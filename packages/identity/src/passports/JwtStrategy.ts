import { PromiseUtil } from '@tsdi/ioc';
import { Component, Input, AfterInit } from '@tsdi/components';
import { IContext } from '@mvx/mvc';
import { Strategy } from './Strategy';
import { AuthenticateOption, IStrategyOption } from './IAuthenticator';
import { Context, Request } from 'koa';
import { ValidationResult, FailResult, SuccessResult } from './results';
import * as url from 'url';
import * as jwt from 'jsonwebtoken';


export type JwtVerify = (payload: any, ctx?: IContext) => Promise<{ user, info }>;

/**
 * JwtStrategyOption Option
 *
 * @export
 * @interface JwtStrategyOption
 * @extends {IStrategyOption}
 */
export interface JwtStrategyOption extends IStrategyOption {
    secretOrKey?: string | Buffer;
    secretOrKeyProvider?: (request: Request, rawJwtToken) => Promise<string | Buffer>;
    jwtFromRequest: (request: Request) => any;
    verify: JwtVerify;
    // If defined issuer will be verified against this value
    issuer: string;

    audience: string | string[];
    algorithms: jwt.Algorithm[];
    ignoreExpiration?: boolean;
    passReqToCallback?
}

/**
 * Jwt authenticate strategy
 */
@Component({
    selector: 'jwt'
})
export class JwtStrategy extends Strategy implements AfterInit {

    @Input() protected verify: JwtVerify;
    @Input() issuer: string;
    @Input() audience: string | string[];
    @Input() algorithms: jwt.Algorithm[];
    @Input() ignoreExpiration?: boolean;
    @Input() secretOrKey: string | Buffer;
    @Input() secretOrKeyProvider: (request: Request, rawJwtToken) => Promise<string | Buffer>;
    @Input() jwtFromRequest: (request: Request) => any;

    async onAfterInit(): Promise<void> {
        if (!this.name) {
            this.name = 'jwt';
        }

        if (this.secretOrKey) {
            if (this.secretOrKeyProvider) {
                throw new TypeError('JwtStrategy has been given both a secretOrKey and a secretOrKeyProvider');
            }
            this.secretOrKeyProvider = async (request, rawJwtToken) => {
                return this.secretOrKey;
            };
        }

        if (!this.secretOrKeyProvider) {
            throw new TypeError('JwtStrategy requires a secret or key');
        }

        if (!this.verify) {
            throw new TypeError('JwtStrategy requires a verify');
        }
        if (!this.jwtFromRequest) {
            throw new TypeError('JwtStrategy requires a function to retrieve jwt from requests (see option jwtFromRequest)');
        }
    }

    async authenticate(ctx: Context, options?: AuthenticateOption): Promise<ValidationResult> {
        let token = this.jwtFromRequest(ctx.request);
        if (!token) {
            return new FailResult('No auth token', 401);
        }
        let secretOrKey = this.secretOrKey = await this.secretOrKeyProvider(ctx.request, token)

        let payload = await new Promise((r, j) => {
            jwt.verify(token, secretOrKey, {
                audience: this.audience,
                issuer: this.issuer,
                algorithms: this.algorithms,
                ignoreExpiration: this.ignoreExpiration
            }, (err, decoded) => {
                if (err) {
                    j(err);
                } else {
                    r(decoded);
                }
            });
        });

        let { user, info } = await this.verify(payload, ctx as IContext);

        if (!user) {
            // TODO, not sure 401 is the correct meaning
            return new FailResult(info, 401);
        }
        return new SuccessResult(options, user, info);
    }

    sign(payload: string | object | Buffer, secretOrKey?: jwt.Secret, options?: jwt.SignOptions): Promise<string> {
        let defer = PromiseUtil.defer<string>();
        jwt.sign(payload, secretOrKey || this.secretOrKey, {
            audience: this.audience,
            issuer: this.issuer,
            // algorithm: 'HS256',
            ...(options || {})
            // ignoreExpiration: this.ignoreExpiration
        }, (err, decoded) => {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(decoded);
            }
        });
        return defer.promise;
    }

}


const matcExp = /(\S+)\s+(\S+)/;
function parseAuthHeader(hdrValue) {
    if (typeof hdrValue !== 'string') {
        return null;
    }
    var matches = hdrValue.match(matcExp);
    return matches && { scheme: matches[1], value: matches[2] };
}


// Note: express http converts all headers
// to lower case.
const AUTH_HEADER = 'authorization',
    LEGACY_AUTH_SCHEME = 'JWT',
    BEARER_AUTH_SCHEME = 'bearer';

export namespace JwtRequest {


    export function fromHeader(headerName: string) {
        return function (request) {
            var token = null;
            if (request.headers[headerName]) {
                token = request.headers[headerName];
            }
            return token;
        };
    }

    export function fromBodyField(fieldName) {
        return function (request) {
            var token = null;
            if (request.body && Object.prototype.hasOwnProperty.call(request.body, fieldName)) {
                token = request.body[fieldName];
            }
            return token;
        };
    }

    export function fromUrlQueryParameter(paramName) {
        return function (request) {
            let token = null,
                parsedUrl = url.parse(request.url, true);
            if (parsedUrl.query && Object.prototype.hasOwnProperty.call(parsedUrl.query, paramName)) {
                token = parsedUrl.query[paramName];
            }
            return token;
        };
    }

    export function fromAuthHeaderWithScheme(authScheme) {
        var authSchemeLower = authScheme.toLowerCase();
        return function (request) {

            var token = null;
            if (request.headers[AUTH_HEADER]) {
                var authParams = parseAuthHeader(request.headers[AUTH_HEADER]);
                if (authParams && authSchemeLower === authParams.scheme.toLowerCase()) {
                    token = authParams.value;
                }
            }
            return token;
        };
    }

    export function fromAuthHeaderAsBearerToken() {
        return fromAuthHeaderWithScheme(BEARER_AUTH_SCHEME);
    }

    export function fromExtractors(extractors) {
        if (!Array.isArray(extractors)) {
            throw new TypeError('export function fromExtractors expects an array')
        }

        return function (request) {
            var token = null;
            var index = 0;
            while (!token && index < length) {
                token = extractors[index].call(this, request);
                index++;
            }
            return token;
        }
    }


    /**
     * This extractor mimics the behavior of the v1.*.* extraction logic.
     *
     * This extractor exists only to provide an easy transition from the v1.*.* API to the v2.0.0
     * API.
     *
     * This extractor first checks the auth header, if it doesn't find a token there then it checks the
     * specified body field and finally the url query parameters.
     *
     * @param options
     *          authScheme: Expected scheme when JWT can be found in HTTP Authorize header. Default is JWT.
     *          tokenBodyField: Field in request body containing token. Default is auth_token.
     *          tokenQueryParameterName: Query parameter name containing the token. Default is auth_token.
     */
    export function versionOneCompatibility(options) {
        var authScheme = options.authScheme || LEGACY_AUTH_SCHEME,
            bodyField = options.tokenBodyField || 'auth_token',
            queryParam = options.tokenQueryParameterName || 'auth_token';

        return function (request) {
            var authHeaderExtractor = fromAuthHeaderWithScheme(authScheme);
            var token = authHeaderExtractor(request);

            if (!token) {
                var bodyExtractor = fromBodyField(bodyField);
                token = bodyExtractor(request);
            }

            if (!token) {
                var queryExtractor = fromUrlQueryParameter(queryParam);
                token = queryExtractor(request);
            }

            return token;
        };
    }
}
