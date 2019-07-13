import {
    lang, Injectable, Type, getMethodMetadata, isFunction, isBaseType,
    isUndefined, ParamProviders, Provider, isClass, IParameter, isObject,
    isArray, isPromise, getTypeMetadata,
    isString, RuntimeLifeScope, Inject, InjectToken, getClassDecorators, isNumber
} from '@tsdi/ioc';
import { MvcRoute, RouteUrlArgToken } from './Route';
import { IContext } from '../IContext';
import { RequestMethod, parseRequestMethod, methodToString } from '../RequestMethod';
import { RouteMetadata, CorsMetadata } from '../metadata';
import { HttpError, ForbiddenError } from '../errors';
import { ResultValue } from '../results';
import { Cors, Route } from '../decorators';
import { BuilderService, BaseTypeParserToken } from '@tsdi/boot';
import { ModelParser } from './ModelParser';
import { DefaultModelParserToken } from './IModelParser';
import { isMiddlewareFunc, isMvcMiddleware, MvcMiddleware, MvcMiddlewares } from '../middlewares';

declare let Buffer: any;

export function isBuffer(target: any): boolean {
    if (typeof Buffer === 'undefined') {
        return false;
    } else {
        return lang.getClass(target) === Buffer;
    }
}

export const RouteControllerArgToekn = new InjectToken<Type>('route_controller_args');

@Injectable
export class ControllerRoute extends MvcRoute {

    constructor(@Inject(RouteUrlArgToken) url: string, @Inject(RouteControllerArgToekn) private controller: Type) {
        super(url);
    }

    async navigate(ctx: IContext, next: () => Promise<void>): Promise<void> {
        try {
            await this.invokeOption(ctx, async () => {
                if (ctx.method !== 'OPTIONS') {
                    await this.invoke(ctx);
                    return await next();
                } else {
                    throw new ForbiddenError();
                }
            });
        } catch (err) {
            this.catchHttpError(ctx, err);
        }
    }



    async invokeOption(ctx: IContext, next: () => Promise<void>): Promise<void> {
        let requestOrigin = ctx.get('Origin');
        ctx.vary('Origin');
        if (!requestOrigin) {
            return await next();
        }

        let config = ctx.mvcContext.configuration;
        let options = config.corsOptions || {};

        let origin;
        if (isFunction(options.origin)) {
            origin = options.origin(ctx);
            if (isPromise(origin)) {
                origin = await origin;
            }
            if (!origin) {
                return await next();
            }
        } else {
            origin = options.origin || requestOrigin;
        }
        let headersSet: any = {};

        let set = (key, value) => {
            ctx.set(key, value);
            headersSet[key] = value;
        };

        if (ctx.method !== 'OPTIONS') {
            set('Access-Control-Allow-Origin', origin);
            if (options.credentials === true) {
                set('Access-Control-Allow-Credentials', 'true');
            }

            if (options.exposeHeaders) {
                set('Access-Control-Expose-Headers', options.exposeHeaders);
            }

            if (!options.keepHeadersOnError) {
                return await next();
            }

            try {
                return await next();
            } catch (err) {
                err.headers = Object.assign({}, err.headers, headersSet);
                this.catchHttpError(ctx, err);
            };
        } else {
            let coremeta = this.getCorsMeta(ctx, ctx.get('Access-Control-Request-Method'));
            if (!coremeta) {
                return await next();
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


    protected catchHttpError(ctx: IContext, err: HttpError) {
        if (err instanceof HttpError) {
            ctx.status = err.status;
            ctx.message = err.message;
        }
        throw err;
    }

    protected getCorsMeta(ctx: IContext, reqMethod: string): CorsMetadata {
        if (!reqMethod) {
            return null;
        }

        let method = parseRequestMethod(reqMethod);

        let meta = this.getRouteMetaData(ctx, method);

        if (meta && meta.propertyKey) {
            let corsmetas = getMethodMetadata<CorsMetadata>(Cors, this.controller)[meta.propertyKey.toString()] || [];
            if (corsmetas.length < 1) {
                corsmetas = getTypeMetadata<CorsMetadata>(Cors, this.controller);
            }
            if (corsmetas.length) {
                return corsmetas.find(cor => {
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
    async invoke(ctx: IContext) {
        let meta = this.getRouteMetaData(ctx, parseRequestMethod(ctx.method));
        let container = this.container;
        if (meta && meta.propertyKey) {
            let ctrl = container.get(this.controller);
            let lifeScope = container.getActionRegisterer().get(RuntimeLifeScope);

            let params = lifeScope.getMethodParameters(this.container, this.controller, ctrl, meta.propertyKey);
            let providers = await this.createProvider(ctx, ctrl, meta, params);
            let result: any = await container.invoke(ctrl, meta.propertyKey, ...providers);
            if (isPromise(result)) {
                result = await result;
            }
            if (isMiddlewareFunc(result)) {
                await result(ctx);
            } else if (result instanceof MvcMiddleware || result instanceof MvcMiddlewares) {
                await result.execute(ctx, null);
            } else if (isBaseType(result) || isArray(result) || isBuffer(result)) {
                if (isBuffer(result)) {
                    if (typeof Buffer !== 'undefined') {
                        ctx.body = Buffer.from(result)
                    } else {
                        ctx.body = result;
                    }
                } else {
                    ctx.body = result;
                }
            } else if (isObject(result)) {
                if (result instanceof ResultValue) {
                    await result.sendValue(ctx, container);
                } else {
                    ctx.body = result;
                }
            } else {
                ctx.body = result;
                ctx.status = 200;
            }
        }
    }

    protected async createProvider(ctx: IContext, ctrl: any, meta: RouteMetadata, params: IParameter[]): Promise<ParamProviders[]> {
        if (params && params.length) {
            let restParams: any = {};
            if (this.isRestUri(meta.route)) {
                let routes = meta.route.split('/').map(r => r.trim());
                let restParamNames = routes.filter(d => /^\S*:/.test(d));
                let baseURL = this.vaildify(this.url, true);
                let routeUrls = this.vaildify(ctx.url.replace(baseURL, '')).split('/');
                restParamNames.forEach(pname => {
                    let val = routeUrls[routes.indexOf(pname)];
                    restParams[pname.substring(1)] = val;
                });
            }
            let body = ctx.request.body || {};

            let providers: ParamProviders[] = await Promise.all(params.map(async (param, idx) => {
                let ptype = param.type;
                let val = null;
                if (isFunction(ptype)) {
                    if (isBaseType(ptype)) {
                        let paramVal = restParams[param.name];
                        if (isUndefined(paramVal)) {
                            paramVal = ctx.request.query[param.name];
                        }
                        let parser = this.container.get(BaseTypeParserToken);
                        val = parser.parse(ptype, paramVal);
                    } else if (isClass(ptype)) {
                        let mdparser = this.container.getService({ token: ModelParser, target: [ptype, ...getClassDecorators(ptype)], defaultToken: DefaultModelParserToken });
                        if (mdparser) {
                            val = mdparser.parseModel(ptype, body);
                        } else {
                            val = await this.container.get(BuilderService).resolve(ptype, { template: body })
                        }
                    }
                }
                return Provider.createParam(param.name || ptype, val, idx);
            }))
            return providers.filter(p => p !== null);
        }

        return [];
    }

    protected isRestUri(uri: string) {
        return /\/:/.test(uri || '');
    }


    protected getRouteMetaData(ctx: IContext, requestMethod: RequestMethod) {
        let decoratorName = Route.toString();
        let subRoute = this.vaildify(this.getReqRoute(ctx).replace(this.url, ''), true);
        let methodMaps = getMethodMetadata<RouteMetadata>(decoratorName, this.controller);
        let meta: RouteMetadata;

        let allMethods: RouteMetadata[] = [];
        for (let name in methodMaps) {
            allMethods = allMethods.concat(methodMaps[name]);
        }
        allMethods = allMethods.filter(m => m && m.method === requestMethod);

        allMethods = allMethods.sort((ra, rb) => (rb.route || '').length - (ra.route || '').length);

        meta = allMethods.find(route => this.vaildify(route.route || '', true) === subRoute);
        if (!meta) {
            meta = allMethods.find(route => {
                let uri = this.vaildify(route.route || '', true);
                if (this.isRestUri(uri)) {
                    let idex = uri.indexOf('/:');
                    let url = uri.substring(0, idex);
                    if (url !== subRoute && subRoute.indexOf(url) === 0) {
                        return true;
                    }
                }
                return false;
            });
        }
        return meta;
    }
}
