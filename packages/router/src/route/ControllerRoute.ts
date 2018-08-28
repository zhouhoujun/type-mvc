import { BaseRoute } from './BaseRoute';
import {
    Type, IContainer, getMethodMetadata,
    isClass, getTypeMetadata, isPromise,
    isUndefined, isString, isObject, isArray, isNumber,
    IParameter, Provider, hasClassMetadata, hasMethodMetadata, Providers,
    isBoolean, isDate
} from '@ts-ioc/core';
import {
    IContext, Next, Cors, Route, CorsMetadata,
    RouteMetadata, Authorization, AuthorizationToken, ResultValue,
    UnauthorizedError, NotFoundError, HttpError, BadRequestError, ForbiddenError,
    RequestMethod, methodToString, parseRequestMethod,
    IConfiguration, ConfigurationToken, ModelParserToken
} from '@mvx/mvc';
import { isBuffer } from 'util';

/**
 * controller route.
 *
 * @export
 * @class ControllerRoute
 * @extends {BaseRoute}
 */
export class ControllerRoute extends BaseRoute {
    constructor(route: string, private controller: Type<any>) {
        super(route);
    }

    async options(container: IContainer, ctx: IContext, next: Next): Promise<any> {
        try {
            await this.invokeOption(ctx, container, next);
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

    async navigating(container: IContainer, ctx: IContext, next: Next): Promise<any> {
        try {
            if (ctx.method !== 'OPTIONS') {
                await this.invoke(ctx, container);
            } else {
                throw new ForbiddenError();
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


        let config = container.get<IConfiguration>(ConfigurationToken);
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
            let coremeta = this.getCorsMeta(ctx, container, ctx.get('Access-Control-Request-Method'));
            // console.log('coremeta', coremeta);
            if (!coremeta) {
                return next();
            }
            options = Object.assign({}, options, coremeta);
            ctx.set('Access-Control-Allow-Origin', origin);

            if (options.credentials === true) {
                ctx.set('Access-Control-Allow-Credentials', 'true');
            }

            let maxAge = String(options.maxAge);
            if (maxAge) {
                ctx.set('Access-Control-Max-Age', maxAge);
            }

            let allowsM: string = isArray(options.allowMethods) ?
                options.allowMethods.map(m => methodToString(m)).filter(m => !!m).join(',')
                : options.allowMethods;
            allowsM = allowsM || 'GET,HEAD,PUT,POST,DELETE,PATCH';
            if (allowsM) {
                ctx.set('Access-Control-Allow-Methods', allowsM);
            }

            let allowH = isArray(options.allowHeaders) ? options.allowHeaders.filter(m => !!m).join(',') : options.allowHeaders;
            if (!allowH) {
                allowH = ctx.get('Access-Control-Request-Headers');
            }
            if (allowH) {
                ctx.set('Access-Control-Allow-Headers', allowH);
            }

            ctx.status = 204;
        }
    }


    getCorsMeta(ctx: IContext, container: IContainer, reqMethod: string): CorsMetadata {
        if (!reqMethod) {
            return null;
        }

        let method = parseRequestMethod(reqMethod);

        let meta = this.getRouteMetaData(ctx, container, method);

        if (meta && meta.propertyKey) {
            let corsmetas = getMethodMetadata<CorsMetadata>(Cors, this.controller)[meta.propertyKey.toString()] || [];
            if (corsmetas.length < 1) {
                corsmetas = getTypeMetadata<CorsMetadata>(Cors, this.controller);
            }
            if (corsmetas.length) {
                return corsmetas.find(cor => {
                    // console.log('find CorsMetadata:', cor);
                    if (!cor.allowMethods) {
                        return true;
                    }
                    if (cor.allowMethods) {
                        if (isString(cor.allowMethods)) {
                            return cor.allowMethods.toUpperCase().indexOf(reqMethod) >= 0;
                        } else if (isArray(cor.allowMethods)) {
                            return cor.allowMethods.some(c => methodToString(c) === reqMethod);
                        }
                    }
                    return false;
                });
            }
        }
        return null;
    }
    async invoke(ctx: IContext, container: IContainer) {
        let meta = this.getRouteMetaData(ctx, container, parseRequestMethod(ctx.method));
        if (meta && meta.propertyKey) {
            let ctrl = container.get(this.controller);
            if (container.has(AuthorizationToken)) {
                let hasAuth = hasClassMetadata(Authorization, ctrl) || hasMethodMetadata(Authorization, ctrl, meta.propertyKey);
                if (hasAuth) {
                    let auth = container.get(AuthorizationToken);
                    if (!auth.isAuth()) {
                        throw new UnauthorizedError();
                    }
                }
            }

            let lifeScope = container.getLifeScope();

            let params =  lifeScope.getMethodParameters(this.controller, ctrl, meta.propertyKey);
            let providers = this.createProvider(container, ctx, ctrl, meta, params);
            let response: any = await container.invoke(this.controller, meta.propertyKey, ctrl, ...providers);

            if (isPromise(response)) {
                response = await response;
            }
            let contentType: string = meta.contentType;
            if (isString(response) || isBoolean(response) || isNumber(response) || isArray(response) || isDate(response) || isBuffer(response)) {
                ctx.body = isBuffer(response) ? Buffer.from(response) : response;
            } else if (isObject(response)) {
                if (response instanceof ResultValue) {
                    await response.sendValue(ctx, container);
                } else {
                    ctx.body = response;
                }
            }

        } else {
            throw new NotFoundError();
        }
    }

    protected createProvider(container: IContainer, ctx: IContext, ctrl: any, meta: RouteMetadata, params: IParameter[]): Providers[] {

        let parser = container.get(ModelParserToken);

        if (params && params.length) {
            let restParams: any = {};
            if (this.isRestUri(meta.route)) {
                let routes = meta.route.split('/').map(r => r.trim());
                let restParamNames = routes.filter(d => /^\S*:/.test(d)); // .map(rest => rest.substring(1));
                let baseURL = this.cutEmptyPath(this.url, true);
                let routeUrls = this.cutEmptyPath(ctx.url.replace(baseURL, '')).split('/');

                restParamNames.forEach(pname => {
                    let val = routeUrls[routes.indexOf(pname)];
                    restParams[pname.substring(1)] = val;
                });

            }
            let body = ctx.request['body'] || {};
            let providers = params.map((param, idx) => {
                try {
                    let ptype = param.type;
                    if (isClass(ptype) && parser.isModel(ptype)) {
                        let val = parser.parseModel(ptype, body);
                        return Provider.createParam(param.name || ptype, val, idx)

                    } else if (parser.isBaseType(ptype)) {
                        let paramVal = restParams[param.name];
                        if (isUndefined(paramVal)) {
                            paramVal = ctx.request.query[param.name];
                        }
                        if (!isUndefined(paramVal)) {
                            let val = parser.parseBaseType(ptype, paramVal);
                            return Provider.createParam(param.name, val, idx);
                        } else {
                            return null;
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


    protected getRouteMetaData(ctx: IContext, container: IContainer, requestMethod: RequestMethod) {
        let decoratorName = Route.toString();
        let baseURL = this.cutEmptyPath(this.url, true);
        let routPath = this.cutEmptyPath(ctx.url.replace(baseURL, ''));
        let methodMaps = getMethodMetadata<RouteMetadata>(decoratorName, this.controller);
        let meta: RouteMetadata;

        let allMethods: RouteMetadata[] = [];
        for (let name in methodMaps) {
            allMethods = allMethods.concat(methodMaps[name]);
        }
        allMethods = allMethods.filter(m => m && m.method === requestMethod);

        allMethods = allMethods.sort((ra, rb) => (rb.route || '').length - (ra.route || '').length);

        meta = allMethods.find(route => (route.route || '') === routPath);
        if (!meta) {
            meta = allMethods.find(route => {
                let uri = route.route || '';
                if (this.isRestUri(uri)) {
                    let idex = uri.indexOf('/:');
                    let url = uri.substring(0, idex);
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
