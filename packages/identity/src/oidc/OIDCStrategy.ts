import { Strategy, ValidationResult, FailResult, SuccessResult } from '../passports';
import { Context } from 'koa';
import { OIDCError, InternalOAuthError, InvalidToken } from '../errors';
import { Injectable, isArray, isFunction } from '@tsdi/ioc';
import { SessionStore, StateStore } from '../stores';
import { parse, resolve, format } from 'url';
import { OAuth2, OAuth2Error } from './oauth2';

// ctx, iss, sub, profile, jwtClaims, accessToken, refreshToken, params
export type VerifyFunction = (ctx: Context, iss: string, sub: string, profile: any, jwtClaims?: string, accessToken?: string, refreshToken?: string, params?: any)
    => Promise<{ user, info }>;

export interface OIDCOption {
    sessionKey?: string;
    identifierField?: string;
    scope: string | string[];
    store?: SessionStore;

    issuer?: string;
    authorizationURL?: string;
    tokenURL?: string;
    clientID: string;
    clientSecret: string;
    callbackURL?: string;
    userInfoURL?: string;
    customHeaders?: any;
    skipUserProfile?: boolean | ((issuer: string, subject: string) => Promise<any>);
    passReqToCallback?: string;
}


@Injectable(Strategy, 'openidconnect')
export class OIDCStrategy extends Strategy {

    protected stateStore: StateStore;
    protected options: OIDCOption;

    constructor(options: OIDCOption, protected verify: VerifyFunction) {
        super();
        this.name = 'openidconnect';
        this.init(options);
    }


    protected init(options: OIDCOption) {
        this.options = options = Object.assign({}, {
            identifierField: 'openid_identifier',
            sessionKey: ('oauth2:' + parse(options.authorizationURL).hostname)
        }, options);

        if (options.store instanceof StateStore) {
            this.stateStore = options.store;
        } else {
            this.stateStore = new SessionStore(options.sessionKey);
        }

        if (options.authorizationURL && options.tokenURL) {
            // This OpenID Connect strategy is configured to work with a specific
            // provider.  Override the discovery process with pre-configured endpoints.
            this.configure(require('./setup/manual')(options));
            // this.configure(require('./setup/dynamic')(options));
        } else {
            this.configure(require('./setup/dynamic')(options));
        }
    }

    configure(identifier) {
        // this._setup = identifier;
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

            const { user, info } = await this.verify(ctx, this.options.passReqToCallback ? iss : undefined, sub, profile, jwtClaims, accessToken, refreshToken, accessTokenResult);

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
            let idfield = this.options.identifierField;
            if (ctx.body && ctx.body[idfield]) {
                identifier = ctx.body[idfield];
            } else if (ctx.query && ctx.query[idfield]) {
                identifier = ctx.query[idfield];
            }


            // let callbackURL = options.callbackURL || this.options.callbackURL;
            // if (callbackURL) {
            //     const parsed = parse(callbackURL);
            //     if (!parsed.protocol) {
            //         // The callback URL is relative, resolve a fully qualified URL from the
            //         // URL of the originating request.
            //         callbackURL = resolve(ctx.request.origin, callbackURL);
            //     }
            // }


        }
    }

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
    protected authorizationParams(options): any {
        return {};
    }

    private async shouldLoadUserProfile(issuer: string, subject: string): Promise<boolean> {
        if (this.options.skipUserProfile) {
            return isFunction(this.options.skipUserProfile) ? await this.options.skipUserProfile(issuer, subject) : false;
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


}
