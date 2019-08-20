import * as http from 'http';
import * as https from 'https';
import * as querystring from 'querystring';
import { parse } from 'url';
import { AuthenticationError } from '../errors';

/**
 * oauth2 error.
 *
 * @export
 * @class OAuth2Error
 * @extends {AuthenticationError}
 */
export class OAuth2Error extends AuthenticationError {
    // tslint:disable-next-line:variable-name
    constructor(status: number, message: string, error_description?: string) {
        super(status, message, error_description);
    }
}

/**
 * oauth2
 *
 * @export
 * @class OAuth2
 */
export class OAuth2 {
    private accessTokenName: string;
    private authMethod: string;
    private useAuthorizationHeaderForGET: boolean;
    private agent; // our agent

    // Allows you to set an agent to use instead of the default HTTP or
    // HTTPS agents. Useful when dealing with your own certificates.
    public set Agent(agent: http.Agent) {
        this.agent = agent;
    }
    public get Agent(): http.Agent {
        return this.agent;
    }

    // This 'hack' method is required for sites that don't use
    // 'access_token' as the name of the access token (for requests).
    // ( http://tools.ietf.org/html/draft-ietf-oauth-v2-16#section-7 )
    // it isn't clear what the correct value should be atm, so allowing
    // for specific (temporary?) override for now.
    public set AccessTokenName(name: string) {
        this.accessTokenName = name;
    }
    public get AccessTokenName(): string {
        return this.accessTokenName;
    }

    // Sets the authorization method for Authorization header.
    // e.g. Authorization: Bearer <token>  # "Bearer" is the authorization method.
    public set AuthMethod(authMethod: string) {
        this.authMethod = authMethod;
    }
    public get AuthMethod(): string {
        return this.authMethod;
    }

    // If you use the OAuth2 exposed 'get' method (and don't construct your own _request call )
    // this will specify whether to use an 'Authorize' header instead of passing the access_token as a query parameter
    public set UseAuthorizationHeaderForGET(useIt) {
        this.useAuthorizationHeaderForGET = useIt;
    }
    public get UseAuthorizationHeaderForGET() {
        return this.useAuthorizationHeaderForGET;
    }

    public get ClientId(): string {
        return this.clientId;
    }

    public get AuthorizeUrl(): string {
        return this.authorizeUrl;
    }

    private get AccessTokenUrl() {
        return `${this.baseSite}${this.accessTokenUrl}`; /* + "?" + querystring.stringify(params); */
    }

    constructor(private clientId: string,
        private clientSecret: string,
        private baseSite: string,
        private authorizeUrl = '/oauth/authorize',
        private accessTokenUrl = '/oauth/access_token',
        private customHeader: any = {}) {
        this.accessTokenName = 'access_token';
        this.authMethod = 'Bearer';
        this.useAuthorizationHeaderForGET = false;
        this.agent = undefined;
    }

    // Build the authorization header. In particular, build the part after the colon.
    // e.g. Authorization: Bearer <token>  # Build "Bearer <token>"
    public buildAuthHeader(token: string): string {
        return `${this.authMethod} ${token}`;
    }

    public getAuthorizeUrl(params: any = {}) {
        params.client_id = this.clientId;
        return `${this.baseSite}${this.authorizeUrl}?${querystring.stringify(params)}`;
    }

    public async getOAuthAccessToken(code, params: any = {}) {
        params.client_id = this.clientId;
        params.client_secret = this.clientSecret;
        const codeParam = (params.grant_type === 'refresh_token') ? 'refresh_token' : 'code';
        params[codeParam] = code;

        const postData = querystring.stringify(params);
        const postHeaders = {
            'Content-Type': 'application/x-www-form-urlencoded',
        };

        const { result } = await this.request('POST', this.AccessTokenUrl, postHeaders, postData, null);
        let data;
        try {
            // As of http://tools.ietf.org/html/draft-ietf-oauth-v2-07
            // responses should be in JSON
            data = JSON.parse(result);
        } catch (error) {
            // .... However both Facebook + Github currently use rev05 of the spec
            // and neither seem to specify a content-type correctly in their response headers :(
            // clients of these services will suffer a *minor* performance cost of the exception
            // being thrown
            data = querystring.parse(result);
        }

        const accessToken = data[this.AccessTokenName];
        if (!accessToken) {
            throw new OAuth2Error(400, JSON.stringify(params));
        }
        const refreshToken = data.refresh_token;
        delete data.refresh_token;
        return {
            accessToken,
            refreshToken,
            result: data,
        };
    }

    public async get(url: string, accessToken: string) {
        let headers = {};
        if (this.useAuthorizationHeaderForGET) {
            headers = { Authorization: this.buildAuthHeader(accessToken) };
            accessToken = null;
        }
        return await this.request('GET', url, headers, '', accessToken);
    }

    public request(method: string, url: string, headers: any = {},
        postBody?: string | Buffer, accessToken?: string): Promise<{ result: string, response: any }> {

        const parsedUrl = parse(url, true);
        if (parsedUrl.protocol === 'https:' && !parsedUrl.port) {
            parsedUrl.port = '443';
        }
        const realHeaders = Object.assign({}, this.customHeader, headers);
        realHeaders.Host = parsedUrl.host;

        if (!realHeaders['User-Agent']) {
            realHeaders['User-Agent'] = 'Node-oauth';
        }

        realHeaders['Content-Length'] = 0;
        if (postBody) {
            realHeaders['Content-Length'] = Buffer.isBuffer(postBody) ? postBody.length :
                Buffer.byteLength(postBody);
        }

        if (accessToken && !('Authorization' in realHeaders)) {
            // It seems that the default value of .query return by URL.parse is {}.
            // if (!parsedUrl.query) {
            //     parsedUrl.query = {};
            // }
            parsedUrl.query[this.accessTokenName] = accessToken;
        }

        let queryStr = querystring.stringify(parsedUrl.query);
        if (queryStr) {
            queryStr = '?' + queryStr;
        }
        const options = {
            protocol: parsedUrl.protocol,
            host: parsedUrl.hostname,
            port: parsedUrl.port,
            path: parsedUrl.pathname + queryStr,
            method,
            headers: realHeaders,
        };
        return new Promise((resolve, reject) => {
            this.executeRequest(options, postBody,
                (err, result, response) => err ? reject(err) : resolve({ result, response }));
        });
    }

    private executeRequest(options, postBody, callback) {
        let callbackCalled = false;

        let result = '';
        // set the agent on the request options
        if (this.agent) {
            options.agent = this.agent;
        }

        const request = options.protocol !== 'https:' ? http.request(options) : https.request(options);
        request.on('response', (response) => {
            response.on('data', (chunk) => {
                result += chunk;
            });
            response.addListener('end', () => {
                if (!callbackCalled) {
                    callbackCalled = true;
                    if (!(response.statusCode >= 200 && response.statusCode <= 299) &&
                        (response.statusCode !== 301) && (response.statusCode !== 302)) {
                        callback(new OAuth2Error(response.statusCode, result));
                    } else {
                        callback(null, result, response);
                    }
                }
            });
        });
        request.on('error', (e) => {
            callbackCalled = true;
            callback(e);
        });

        if ((options.method === 'POST' || options.method === 'PUT') && postBody) {
            request.write(postBody);
        }
        request.end();
    }
}
