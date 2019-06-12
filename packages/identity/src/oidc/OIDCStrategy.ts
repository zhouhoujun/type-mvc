import { Strategy, ValidationResult, FailResult } from '../passports';
import { Context } from 'koa';
import * as url from 'url';
import { OAuth2 } from 'oauth';
import { OIDCError, InternalOAuthError } from '../errors';
import { Injectable } from '@tsdi/ioc';
import { SessionStore } from './SessionStore';


export interface OIDCOption {
    identifierField?: string;
    scope: string[];
    store: SessionStore;
}


@Injectable(Strategy, 'oidc')
export class OIDCStrategy extends Strategy {

    protected options: OIDCOption;
    constructor(options) {
        super();
        this.name = 'oidc';
        this.init(options);
    }


    protected init(options: OIDCOption) {
        this.options = options = Object.assign({}, {
            identifierField: 'openid_identifier'
        }, options);
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
            this.options.store.verify(ctx, state, (err, ok, state) => {
                if (err) {
                    throw err;
                }
                if (!ok) {
                    return new FailResult(state, 403);
                }
                var code = ctx.query.code;

                var meta = state;
                var callbackURL = meta.callbackURL;

                var oauth2 = this.getOAuth2Client(meta);

                oauth2.getOAuthAccessToken(code, { grant_type: 'authorization_code', redirect_uri: callbackURL }, (err, accessToken, refreshToken, params) => {
                    if (err) {
                        throw new InternalOAuthError('failed to obtain access token', err);
                    }

                    var idToken = params['id_token'];
                    if (!idToken) {
                        throw new Error('ID Token not present in token response');
                    }

                    var idTokenSegments = idToken.split('.')
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
                    } else if (Array.isArray(jwtClaims.aud)) {
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

                    this.shouldLoadUserProfile(iss, sub, (err, load) => {
                        if (err) {
                            throw err;
                        }

                        if (load) {
                            var parsed = url.parse(meta.userInfoURL, true);
                            parsed.query['schema'] = 'openid';
                            delete parsed.search;
                            var userInfoURL = url.format(parsed);

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

                            // oauth2.get(userInfoURL, accessToken, function (err, body, res) {
                            oauth2._request('GET', userInfoURL, { 'Authorization': 'Bearer ' + accessToken, 'Accept': "application/json" }, null, null, function (err, body, res) {
                                if (err) {
                                    throw new InternalOAuthError('failed to fetch user profile', err);
                                }

                                let profile: any = {};

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

                                    onProfileLoaded(profile);
                                } catch (ex) {
                                    throw ex;
                                }
                            });
                        } else {
                            onProfileLoaded();
                        }

                        function onProfileLoaded(profile?) {
                            function verified(err, user, info) {
                                if (err) { return self.error(err); }
                                if (!user) { return self.fail(info); }

                                info = info || {};
                                if (state) { info.state = state; }
                                self.success(user, info);
                            }

                            if (self._passReqToCallback) {
                                var arity = self._verify.length;
                                if (arity == 9) {
                                    self._verify(req, iss, sub, profile, jwtClaims, accessToken, refreshToken, params, verified);
                                } else if (arity == 8) {
                                    self._verify(req, iss, sub, profile, accessToken, refreshToken, params, verified);
                                } else if (arity == 7) {
                                    self._verify(req, iss, sub, profile, accessToken, refreshToken, verified);
                                } else if (arity == 5) {
                                    self._verify(req, iss, sub, profile, verified);
                                } else { // arity == 4
                                    self._verify(req, iss, sub, verified);
                                }
                            } else {
                                var arity = self._verify.length;
                                if (arity == 8) {
                                    self._verify(iss, sub, profile, jwtClaims, accessToken, refreshToken, params, verified);
                                } else if (arity == 7) {
                                    self._verify(iss, sub, profile, accessToken, refreshToken, params, verified);
                                } else if (arity == 6) {
                                    self._verify(iss, sub, profile, accessToken, refreshToken, verified);
                                } else if (arity == 4) {
                                    self._verify(iss, sub, profile, verified);
                                } else { // arity == 3
                                    self._verify(iss, sub, verified);
                                }
                            }
                        } // onProfileLoaded
                    }); // self._shouldLoadUserProfile
                });
            });
        } else {
            let identifier;
            if (ctx.body && ctx.body[this.options.identifierField]) {

            }
        }
    }

    shouldLoadUserProfile(issuer, subject, done) {
        if (typeof this._skipUserProfile == 'function' && this._skipUserProfile.length > 1) {
            // async
            this._skipUserProfile(issuer, subject, function (err, skip) {
                if (err) { return done(err); }
                if (!skip) { return done(null, true); }
                return done(null, false);
            });
        } else {
            var skip = (typeof this._skipUserProfile == 'function') ? this._skipUserProfile(issuer, subject) : this._skipUserProfile;
            if (!skip) { return done(null, true); }
            return done(null, false);
        }
    }

    getOAuth2Client(config) {
        return new OAuth2(config.clientID, config.clientSecret,
            '', config.authorizationURL, config.tokenURL);

    }
}
