import { BaseRoute } from './BaseRoute';
import { Type, IContainer, getMethodMetadata, AsyncParamProvider, Token, isToken, Container, isClass, isFunction, getPropertyMetadata, getTypeMetadata, PropertyMetadata } from 'tsioc';
import { IContext } from '../IContext';
import { Next, Defer } from '../util';
import { Get, GetMetadata, RouteMetadata, Post, Put, Delete, Field, Cors, CorsMetadata, Options, Model, Route } from '../decorators';
import { IRoute } from './IRoute';
import { Authorization } from '../decorators';
import { symbols } from '../util';
import { IAuthorization } from '../auth';
import { UnauthorizedError, NotFoundError, HttpError, BadRequestError } from '../errors/index';
import { isUndefined, isBoolean, isString, isObject, isArray, isNumber } from 'util';
import { JsonResult, ResultValue, ViewResult, FileResult } from '../restults';
import { RequestMethod, methodToString, parseRequestMethod } from '../RequestMethod';
import { Configuration, InternalServerError } from '../index';
import { ModelParser } from './ModelParser';

export class ControllerRoute extends BaseRoute {

    constructor(route: string, private controller: Type<any>) {
        super(route);
    }

    async options(container: IContainer, ctx: IContext, next: Next): Promise<any> {
        await this.invokeOption(ctx, container, next);
    }

    async navigating(container: IContainer, ctx: IContext, next: Next): Promise<any> {
        try {
            if (ctx.method !== 'OPTIONS') {
                await this.invoke(ctx, container, (meta: RouteMetadata, params: Token<any>[], ctrl) => this.createProvider(container, meta, params, ctrl, ctx));
            } else {
                throw new BadRequestError();
            }
            return next();
        } catch (err) {
            if (err instanceof HttpError) {
                ctx.status = err.code;
                ctx.message = err.message;
            } else {
                ctx.status = 500;
                console.error(err);
            }
        }

    }

    async invokeOption(ctx: IContext, container: IContainer, next: Next) {
        let requestOrigin = ctx.get('Origin');
        ctx.vary('Origin');
        if (!requestOrigin) {
            return next();
        }
        let origin = requestOrigin;
        let headersSet: any = {};

        let set = (key, value) => {
            ctx.set(key, value);
            headersSet[key] = value;
        };


        let config = container.get(Configuration);
        let options = config.corsOptions || {};
        if (ctx.method !== 'OPTIONS') {


            set('Access-Control-Allow-Origin', origin);

            if (options.credentials === true) {
                set('Access-Control-Allow-Credentials', 'true');
            }

            if (options.exposeHeaders) {
                set('Access-Control-Expose-Headers', options.exposeHeaders);
            }

            if (!options.keepHeadersOnError) {
                return next();
            }
            return next().catch(err => {
                err.headers = Object.assign({}, err.headers, headersSet);
                throw err;
            });
        } else {
            if (!ctx.get('Access-Control-Request-Method')) {
                // this not preflight request, ignore it
                return next();
            }
            let methodCors = getMethodMetadata<CorsMetadata>(Cors, this.controller);
            let method = parseRequestMethod(ctx.get('Access-Control-Request-Method'));

            let meta = this.getRouteMetaData(ctx, container);

            if (meta && meta.propertyKey) {
                let corsmetas = getMethodMetadata<CorsMetadata>(Cors, this.controller)[meta.propertyKey] || [];
                if (corsmetas.length < 1) {
                    corsmetas = getTypeMetadata<CorsMetadata>(Cors, this.controller);
                }
                if (corsmetas.length) {
                    options = Object.assign({}, options, corsmetas[0]);
                    ctx.set('Access-Control-Allow-Origin', origin);

                    if (options.credentials === true) {
                        ctx.set('Access-Control-Allow-Credentials', 'true');
                    }

                    let maxAge = String(options.maxAge);
                    if (maxAge) {
                        ctx.set('Access-Control-Max-Age', maxAge);
                    }

                    let allowsM: string = isArray(options.allowMethods) ? options.allowMethods.map(m => methodToString(m)).join(',') : options.allowMethods;
                    allowsM = allowsM || 'GET,HEAD,PUT,POST,DELETE,PATCH';
                    if (allowsM) {
                        ctx.set('Access-Control-Allow-Methods', allowsM);
                    }

                    let allowH = isArray(options.allowHeaders) ? options.allowHeaders.join(',') : options.allowHeaders;
                    if (!allowH) {
                        allowH = ctx.get('Access-Control-Request-Headers');
                    }
                    if (allowH) {
                        ctx.set('Access-Control-Allow-Headers', allowH);
                    }

                    ctx.status = 204;
                    return;
                }

            }

            return next();

        }
    }
    async invoke(ctx: IContext, container: IContainer, provider: (meta: RouteMetadata, params: Token<any>[], ctrl: any) => AsyncParamProvider[]) {
        let meta = this.getRouteMetaData(ctx, container);
        if (meta && meta.propertyKey) {
            let ctrl = container.get(this.controller);
            if (container.has(symbols.IAuthorization)) {
                let hasAuth = Reflect.hasMetadata(Authorization.toString(), ctrl, meta.propertyKey);
                if (hasAuth) {
                    let auth = container.get<IAuthorization>(symbols.IAuthorization);
                    if (!auth.isAuth()) {
                        throw new UnauthorizedError();
                    }
                }
            }

            let params = container.getMethodParameters(this.controller, ctrl, meta.propertyKey);
            let response: any = await container.invoke(this.controller, meta.propertyKey, ctrl, ...provider(meta, params, ctrl));

            let contentType: string = meta.contentType;
            if (isString(response)) {
                contentType = contentType || 'text/html';
                ctx.response.body = response;
            } else if (isArray(response) && response instanceof Uint8Array) {
                ctx.response.body = Buffer.from(response);
            } else if (isObject(response)) {
                if (response instanceof ResultValue) {
                    await response.sendValue(ctx, container);
                } else {
                    contentType = contentType || 'application/json';
                    ctx.type = contentType;
                    ctx.response.body = response;
                }
            }

        } else {
            throw new NotFoundError();
        }
    }

    protected createProvider(container: IContainer, meta: RouteMetadata, params: Token<any>[], ctrl: any, ctx: IContext): AsyncParamProvider[] {

        let parser = container.get(ModelParser);

        if (params && params.length) {
            let paramVal = null;
            if (this.isRestUri(meta.route)) {
                let route = meta.route.substr(0, meta.route.indexOf('/:')) + '/';
                let baseURL = this.cutEmptyPath(this.url, true);
                let routeUrl = this.cutEmptyPath(ctx.url.replace(baseURL, ''));

                let querystring = routeUrl.replace(route, '');
                paramVal = querystring.indexOf('/') > 0 ? querystring.substr(0, querystring.indexOf('/')) : querystring;

            }
            let body = ctx.request['body'] || {};
            let providers = params.map((p, idx) => {
                try {
                    if (isClass(p) && Reflect.hasOwnMetadata(Model.toString(), p)) {
                        let val = parser.parseModel(p, body);
                        return {
                            value: val,
                            index: idx
                        }

                    } else if (parser.isBaseType(p)) {
                        let val = parser.parseBaseType(p, paramVal);
                        return {
                            value: val,
                            index: idx
                        }
                    } else {
                        return null;
                    }
                } catch (err) {
                    throw new BadRequestError(err.toString());
                }
            });
            return providers.filter(p => p !== null);
        }

        return [];
    }


    protected isRestUri(uri: string) {
        return /\/:/.test(uri || '');
    }


    protected getRouteMetaData(ctx: IContext, container: IContainer) {
        let decoratorName = Route.toString();
        let baseURL = this.cutEmptyPath(this.url, true);
        let routPath = this.cutEmptyPath(ctx.url.replace(baseURL, ''));
        let methodMaps = getMethodMetadata<RouteMetadata>(decoratorName, this.controller);
        let meta: RouteMetadata;

        let allMethods: RouteMetadata[] = [];
        for (let name in methodMaps) {
            allMethods = allMethods.concat(methodMaps[name]);
        }
        let requestMethod = parseRequestMethod(ctx.method);
        allMethods = allMethods.filter(m => m && m.method === requestMethod);

        allMethods = allMethods.sort((ra, rb) => (rb.route || '').length - (ra.route || '').length);

        meta = allMethods.find(route => (route.route || '') === routPath);
        if (!meta) {
            meta = allMethods.find(route => {
                let uri = route.route || '';
                // if (uri === routPath) {
                //     return true;
                // }
                if (this.isRestUri(uri)) {
                    let idex = uri.indexOf('/:');
                    let url = uri.substr(0, idex);
                    if (url !== routPath && routPath.indexOf(url) === 0) {
                        return true;
                    }
                }
                return false;
            });
        }
        return meta;
    }

}
