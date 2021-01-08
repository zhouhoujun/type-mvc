import { isArray, isFunction, Inject, Singleton, PromiseUtil, INJECTOR } from '@tsdi/ioc';
import { ICoreInjector } from '@tsdi/core';
import { AfterInit, Input, Component, TemplateOptionToken } from '@tsdi/components';
import { Strategy } from './Strategy';
import { IStrategyOption } from './IAuthenticator';
import { Context } from 'koa';
import { stringify } from 'querystring';
import { OIDCError, InternalOAuthError, NoOpenIDError } from '../errors';
import { SessionStore, StateStore, OIDCUtils } from '../stores';
import { parse, resolve, format } from 'url';
import { OAuth2, OAuth2Error } from './oauth2';
import { RedirectResult, FailResult, ValidationResult, SuccessResult } from './results';
const webfinger = require('webfinger').webfinger;
const request = require('request');

export type OIDCVerifyFunction = (ctx: Context, iss: string, sub: string, profile: any, jwtClaims?: string, accessToken?: string, refreshToken?: string, params?: any)
    => Promise<{ user, info }>;

export interface OIDCConfigure {
    issuer?: string;
    authorizationURL?: string;
    tokenURL?: string;
    userInfoURL?: string;
    clientID: string;
    clientSecret: string;
    callbackURL?: string;
    registrationURL?: string
    _raw?: any;
    nonce?: any;
    display?: string;
    prompt?: string;
    timestamp?: number;
    params?: any;
}

export interface OIDCOption extends IStrategyOption, OIDCConfigure {
    sessionKey?: string;
    identifierField?: string;
    scope: string | string[];
    store?: SessionStore;
    customHeaders?: any;
    skipUserProfile?: boolean | ((issuer: string, subject: string) => Promise<any>);
    passReqToCallback?: string;
    verify: OIDCVerifyFunction;
    getClient?: (issuer: string) => Promise<any>;
    /**
     * Return extra parameters to be included in the authorization request.
     *
     * Some OAuth 2.0 providers allow additional, non-standard parameters to be
     * included when requesting authorization.  Since these parameters are not
     * standardized by the OAuth 2.0 specification, OAuth 2.0-based authentication
     * strategies can overrride this function in order to populate these parameters
     * as required by the provider.
     *
     */
    authorizationParams: (options) => any;
}

/**
 * OIDC authenticate strategy
 *
 * @export
 * @class OIDCStrategy
 * @extends {Strategy}
 * @implements {AfterInit}
 */
@Component({
    selector: 'oidc'
})
export class OIDCStrategy extends Strategy implements AfterInit {

    @Input('store') protected stateStore: StateStore;
    @Input() protected scope: string | string[];
    @Input() protected identifierField: string;

    @Input() protected issuer: string;
    @Input() protected sessionKey: string;
    @Input() protected tokenURL: string;
    @Input() protected authorizationURL: string;
    @Input() protected clientID: string;
    @Input() protected clientSecret: string;
    @Input() protected callbackURL?: string;
    @Input() protected userInfoURL?: string;
    @Input() protected customHeaders?: any;
    @Input() protected verify: OIDCVerifyFunction;
    @Input() protected passReqToCallback: string;
    @Input() protected skipUserProfile?: boolean | ((issuer: string, subject: string) => Promise<any>);

    /**
     * Return extra parameters to be included in the authorization request.
     *
     * Some OAuth 2.0 providers allow additional, non-standard parameters to be
     * included when requesting authorization.  Since these parameters are not
     * standardized by the OAuth 2.0 specification, OAuth 2.0-based authentication
     * strategies can overrride this function in order to populate these parameters
     * as required by the provider.
     *
     */
    @Input() protected authorizationParams: (options) => any;

    @Inject(TemplateOptionToken)
    options: OIDCOption;


    @Inject(INJECTOR) injector: ICoreInjector;

    async onAfterInit(): Promise<void> {
        if (!this.name) {
            this.name = 'openidconnect';
        }
        if (!this.identifierField) {
            this.identifierField = 'openid_identifier';
        }

        if (!this.sessionKey) {
            this.sessionKey = ('oauth2:' + parse(this.authorizationURL).hostname)
        }

        if (this.stateStore) {
            this.stateStore = new SessionStore(this.sessionKey);
        }

        if (!(this.authorizationURL && this.tokenURL) && this.options.getClient) {
            throw new Error('OpenID Connect authentication requires getClientCallback option')
        }

    }


    async authenticate(ctx: Context, options?: any): Promise<ValidationResult> {
        options = options || {};
        if (ctx.query && ctx.query.error) {
            if (ctx.query.error === 'access_denied') {
                return new FailResult(ctx.query.error_description, 403);
            } else {
                throw new OIDCError(ctx.query.error_description, ctx.query.error, ctx.query.error_uri);
            }
        }

        if (ctx.query && ctx.query.code) {
            let state = ctx.query.state;
            const { result: verifiedResult, state: meta, message: verifiedMsg } = await this.stateStore.verify(ctx, state);
            if (!verifiedResult) {
                return new FailResult(verifiedMsg, 403);
            }
            const code = ctx.query.code;
            let callbackURL = meta.callbackURL;

            let oauth2 = new OAuth2(meta.clientID, meta.clientSecret,
                '', meta.authorizationURL, meta.tokenURL, meta.customHeaders);
            let accessToken;
            let refreshToken;
            let accessTokenResult;
            try {
                ({
                    accessToken,
                    refreshToken,
                    result: accessTokenResult,
                } = await oauth2.getOAuthAccessToken(code, { grant_type: 'authorization_code', redirect_uri: callbackURL }));
            } catch (err) {
                throw this.parseOAuthError(err);
            }

            var idToken = accessTokenResult['id_token'];
            if (!idToken) {
                throw new Error('ID Token not present in token response');
            }

            let idTokenSegments = idToken.split('.')
                , jwtClaimsStr
                , jwtClaims;

            try {
                jwtClaimsStr = new Buffer(idTokenSegments[1], 'base64').toString();
                jwtClaims = JSON.parse(jwtClaimsStr);
            } catch (ex) {
                throw ex;
            }

            var missing = ['iss', 'sub', 'aud', 'exp', 'iat'].filter(param => !jwtClaims[param]);
            if (missing.length) {
                throw new Error('id token is missing required parameter(s) - ' + missing.join(', '));
            }

            // https://openid.net/specs/openid-connect-basic-1_0.html#IDTokenValidation - check 1.
            if (jwtClaims.iss !== meta.issuer) {
                throw new Error('id token not issued by correct OpenID provider - ' +
                    'expected: ' + meta.issuer + ' | from: ' + jwtClaims.iss);
            }

            // https://openid.net/specs/openid-connect-basic-1_0.html#IDTokenValidation - checks 2 and 3.
            if (typeof jwtClaims.aud === 'string') {
                if (jwtClaims.aud !== meta.clientID) {
                    throw new Error('aud parameter does not include this client - is: '
                        + jwtClaims.aud + '| expected: ' + meta.clientID);
                }
            } else if (isArray(jwtClaims.aud)) {
                if (jwtClaims.aud.indexOf(meta.clientID) === -1) {
                    throw new Error('aud parameter does not include this client - is: ' +
                        jwtClaims.aud + ' | expected to include: ' + meta.clientID);
                }
                if (jwtClaims.length > 1 && !jwtClaims.azp) {
                    throw new Error('azp parameter required with multiple audiences');
                }
            } else {
                throw new Error('Invalid aud parameter type');
            }

            // https://openid.net/specs/openid-connect-basic-1_0.html#IDTokenValidation - check 4.
            if (jwtClaims.azp && jwtClaims.azp !== meta.clientID) {
                throw new Error('this client is not the authorized party - ' +
                    'expected: ' + meta.clientID + ' | is: ' + jwtClaims.azp);
            }

            // Possible TODO: Add accounting for some clock skew.
            // https://openid.net/specs/openid-connect-basic-1_0.html#IDTokenValidation - check 5.
            if (jwtClaims.exp < (Date.now() / 1000)) {
                throw new Error('id token has expired');
            }

            // Note: https://openid.net/specs/openid-connect-basic-1_0.html#IDTokenValidation - checks 6 and 7 are out of scope of this library.

            // https://openid.net/specs/openid-connect-basic-1_0.html#IDTokenValidation - check 8.
            if (meta.params.max_age && (!jwtClaims.auth_time || ((meta.timestamp - meta.params.max_age) > jwtClaims.auth_time))) {
                throw new Error('auth_time in id_token not included or too old');
            }

            if (meta.params.nonce && (!jwtClaims.nonce || jwtClaims.nonce !== meta.params.nonce)) {
                throw new Error('Invalid nonce in id_token');
            }

            var iss = jwtClaims.iss;
            var sub = jwtClaims.sub;
            // Prior to OpenID Connect Basic Client Profile 1.0 - draft 22, the
            // "sub" claim was named "user_id".  Many providers still issue the
            // claim under the old field, so fallback to that.
            if (!sub) {
                sub = jwtClaims.user_id;
            }

            let load = await this.shouldLoadUserProfile(iss, sub);
            let profile: any = undefined;
            if (load) {
                var parsed = parse(meta.userInfoURL, true);
                parsed.query['schema'] = 'openid';
                delete parsed.search;
                var userInfoURL = format(parsed);

                // NOTE: We are calling node-oauth's internal `_request` function (as
                //       opposed to `get`) in order to send the access token in the
                //       `Authorization` header rather than as a query parameter.
                //
                //       Additionally, the master branch of node-oauth (as of
                //       2013-02-16) will include the access token in *both* headers
                //       and query parameters, which is a violation of the spec.
                //       Setting the fifth argument of `_request` to `null` works
                //       around this issue.  I've noted this in comments here:
                //       https://github.com/ciaranj/node-oauth/issues/117

                const { result: body, response: res } = await oauth2.request('GET', userInfoURL, { 'Authorization': 'Bearer ' + accessToken, 'Accept': 'application/json' }, null, null);

                profile = {};
                try {
                    var json = JSON.parse(body);
                    profile.id = json.sub;
                    // Prior to OpenID Connect Basic Client Profile 1.0 - draft 22, the
                    // "sub" key was named "user_id".  Many providers still use the old
                    // key, so fallback to that.
                    if (!profile.id) {
                        profile.id = json.user_id;
                    }

                    profile.displayName = json.name;
                    profile.name = {
                        familyName: json.family_name,
                        givenName: json.given_name,
                        middleName: json.middle_name
                    };

                    profile._raw = body;
                    profile._json = json;
                } catch (ex) {
                    throw ex;
                }
            }

            const { user, info } = await this.verify(ctx, this.passReqToCallback ? iss : undefined, sub, profile, jwtClaims, accessToken, refreshToken, accessTokenResult);

            if (!user) {
                // TODO, not sure 401 is the correct meaning
                return new FailResult(info, 401);
            }
            return new SuccessResult(options, user, info);

        } else {
            // The request being authenticated is initiating OpenID Connect
            // authentication.  Prior to redirecting to the provider, configuration will
            // be loaded.  The configuration is typically either pre-configured or
            // discovered dynamically.  When using dynamic discovery, a user supplies
            // their identifer as input.

            let identifier;
            let idfield = this.identifierField;
            if (ctx.request.body && ctx.request.body[idfield]) {
                identifier = ctx.request.body[idfield];
            } else if (ctx.query && ctx.query[idfield]) {
                identifier = ctx.query[idfield];
            }

            let meta = await this.getConfigure(identifier);
            let callbackURL = options.callbackURL || this.callbackURL;
            if (callbackURL) {
                const parsed = parse(callbackURL);
                if (!parsed.protocol) {
                    // The callback URL is relative, resolve a fully qualified URL from the
                    // URL of the originating request.
                    callbackURL = resolve(ctx.request.origin, callbackURL);
                }
            }
            meta.callbackURL = callbackURL;


            let params = await this.authorizationParams(options);
            params['response_type'] = 'code';
            params['client_id'] = meta.clientID;
            if (callbackURL) { params.redirect_uri = callbackURL; }
            let scope = options.scope || this.scope;
            if (isArray(scope)) { scope = scope.join(' '); }
            if (scope) {
                params.scope = 'openid ' + scope;
            } else {
                params.scope = 'openid';
            }

            // Optional Parameters

            ['max_age', 'ui_locals', 'id_token_hint', 'login_hint', 'acr_values']
                .filter(x => { return x in meta })
                .forEach(y => { params[y] = meta[y] });

            if (meta.display && ['page', 'popup', 'touch', 'wap'].indexOf(meta.display) !== -1) {
                params.display = meta.display;
            }
            if (meta.prompt && ['none', 'login', 'consent', 'select_account'].indexOf(meta.prompt) !== -1) {
                params.prompt = meta.prompt;
            }

            if (meta.nonce && typeof meta.nonce === 'boolean') { params.nonce = OIDCUtils.uid(20); }
            if (meta.nonce && typeof meta.nonce === 'number') { params.nonce = OIDCUtils.uid(meta.nonce); }
            if (meta.nonce && typeof meta.nonce === 'string') { params.nonce = meta.nonce; }

            if (params.max_age) {
                meta.timestamp = Math.floor(Date.now() / 1000);
            }

            meta.params = params;
            for (let param in params) {
                if (meta[param]) {
                    delete meta[param]; // Remove redundant information.
                }
            }

            // State Storage/Management
            try {
                let state = await this.stateStore.store(ctx, meta);
                params.state = state;
                var location = meta.authorizationURL + '?' + stringify(params);
                return new RedirectResult(location);
            } catch (ex) {
                throw ex;
            }

        }
    }

    private async shouldLoadUserProfile(issuer: string, subject: string): Promise<boolean> {
        if (this.skipUserProfile) {
            return isFunction(this.skipUserProfile) ? await this.skipUserProfile(issuer, subject) : false;
        }
        return true;
    }

    private parseOAuthError(err: Error | OAuth2Error) {
        let e;
        if (err instanceof OAuth2Error) {
            try {
                const json = JSON.parse(err.message);
                if (json.error) {
                    e = new InternalOAuthError(`Failed to obtain access token:${json.error_description}`, json.error);
                }
            } catch (_) {
                // console.warn('============This error can be ignored==============');
                // console.warn(_);
                // console.warn('===================================================');
            }
        }
        if (!e) {
            err.message = `Failed to obtain access token:${err.message}`;
            e = err;
        }
        return e;
    }


    protected async getConfigure(identifier: string): Promise<OIDCConfigure> {
        if (this.authorizationURL && this.tokenURL) {
            return await this.manualConfigure(identifier);
        } else {
            return await this.dynamicConfigure(identifier);
        }
    }

    protected async dynamicConfigure(identifier: string): Promise<OIDCConfigure> {
        let issuer = await this.injector.getInstance(Resolver).resolve(identifier);
        let url = issuer + '/.well-known/openid-configuration';
        let defer = PromiseUtil.defer<OIDCConfigure>();
        request.get(url, async (err, res, body) => {
            if (err) { return defer.reject(err); }
            if (res.statusCode !== 200) {
                return defer.reject(new Error('Unexpected status code from OpenID provider configuration: ' + res.statusCode));
            }

            var config = {} as OIDCConfigure;

            try {
                var json = JSON.parse(body);

                config.issuer = json.issuer;
                config.authorizationURL = json.authorization_endpoint;
                config.tokenURL = json.token_endpoint;
                config.userInfoURL = json.userinfo_endpoint;
                config.registrationURL = json.registration_endpoint;

                config._raw = json;

            } catch (ex) {
                return defer.reject(new Error('Failed to parse OpenID provider configuration'));
            }


            // TODO: Pass registrationURL here.
            let client = await this.options.getClient(config.issuer);
            config.clientID = client.id;
            config.clientSecret = client.secret;
            if (client.redirectURIs) {
                config.callbackURL = client.redirectURIs[0];
            }
            return defer.resolve(config);
        });

        return defer.promise;
    }

    protected async manualConfigure(identifier: string): Promise<OIDCConfigure> {
        let missing = ['issuer', 'authorizationURL', 'tokenURL', 'clientID', 'clientSecret'].filter(opt => !this.options[opt]);
        if (missing.length) {
            throw new Error('Manual OpenID configuration is missing required parameter(s) - ' + missing.join(', '));
        }

        let params = {
            issuer: this.issuer,
            authorizationURL: this.authorizationURL,
            tokenURL: this.tokenURL,
            userInfoURL: this.userInfoURL,
            clientID: this.clientID,
            clientSecret: this.clientSecret,
            callbackURL: this.callbackURL
        } as OIDCConfigure

        Object.keys(this.options).map(opt => {
            if (['nonce', 'display', 'prompt', 'max_age', 'ui_locals', 'id_token_hint', 'login_hint', 'acr_values'].indexOf(opt) !== -1) {
                params[opt] = this.options[opt];
            }
        });

        return params;
    }
}


const REL = 'http://openid.net/specs/connect/1.0/issuer';

@Singleton()
export class Resolver {

    resolve(identifier): Promise<string> {
        let defer = PromiseUtil.defer<string>();
        webfinger(identifier, REL, { webfingerOnly: true }, (err, jrd) => {
            if (err) {
                return defer.reject(err);
            }
            if (!jrd.links) {
                return defer.reject(new NoOpenIDError('No links in resource descriptor', jrd));
            }

            let issuer;
            for (let i = 0; i < jrd.links.length; i++) {
                let link = jrd.links[i];
                if (link.rel === REL) {
                    issuer = link.href;
                    break;
                }
            }

            if (!issuer) {
                return defer.reject(new NoOpenIDError('No OpenID Connect issuer in resource descriptor', jrd));
            }
            return defer.resolve(issuer);
        });

        return defer.promise;
    }
}
