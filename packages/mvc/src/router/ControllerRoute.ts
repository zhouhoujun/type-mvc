import {
    lang, Injectable, Type, getMethodMetadata, isFunction, isBaseType,
    isUndefined, Provider, isClass, IParameter, isObject,
    isArray, isPromise, getTypeMetadata, isString, Inject, isNullOrUndefined, tokenId
} from '@tsdi/ioc';
import { ModelParser, DefaultModelParserToken, BaseTypeParserToken, BuilderServiceToken } from '@tsdi/boot';
import { IContext, ContextToken } from '../IContext';
import { RequestMethod, parseRequestMethod, methodToString } from '../RequestMethod';
import { RouteMetadata, CorsMetadata } from '../metadata';
import { HttpError } from '../errors';
import { ResultValue } from '../results/ResultValue';
import { Cors, Route } from '../decorators';
import { MiddlewareType } from '../middlewares/IMiddleware';
import { AuthorizationService } from '../services/AuthorizationService';
import { MvcRoute, RouteUrlArgToken } from './Route';
import { MvcMiddleware } from '../middlewares/MvcMiddleware';
import { MvcMiddlewares } from '../middlewares/MvcMiddlewares';
const vary = require('vary');

declare let Buffer: any;

export function isBuffer(target: any): boolean {
    if (typeof Buffer === 'undefined') {
        return false;
    } else {
        return lang.getClass(target) === Buffer;
    }
}

const emptyNext = async () => { };

export const RouteControllerArgToken = tokenId<Type>('ROUTE_CONTRL_ARGS');

export const RouteControllerMiddlewaresToken = tokenId<any[]>('ROUTE_CONTRL_MIDDLEWARES');

const restParms = /^\S*:/;
const isRest = /\/:/;

@Injectable()
export class ControllerRoute extends MvcRoute {

    constructor(
        @Inject(RouteUrlArgToken) url: string,
        @Inject(RouteControllerArgToken) private controller: Type,
        @Inject(RouteControllerMiddlewaresToken) private middlewares: MiddlewareType[]
    ) {
        super(url);
    }

    navigate(ctx: IContext, next: () => Promise<void>): Promise<void> {
        if(ctx._isCors) {
            return this.options(ctx, next);
        } else {
            return this.navigating(ctx, next);
        }
    }

    async navigating(ctx: IContext, next: () => Promise<void>): Promise<void> {
        let meta = this.getRouteMetaData(ctx, parseRequestMethod(ctx.method));
        if (!meta) {
            return await next();
        }
        let middlewares = this.getRouteMiddleware(ctx, meta);
        if (middlewares.length) {
            await this.execFuncs(ctx, middlewares.map(m => this.toHandle(m)).filter(f => !!f))
        }
        await this.invoke(ctx, meta);
        return await next();
    }

    protected getRouteMiddleware(ctx: IContext, meta: RouteMetadata) {
        let auths = ctx.getInjector().getServices(AuthorizationService);
        let middlewares = this.middlewares || [];
        if (auths) {
            middlewares = auths.map(auth => auth.getAuthMiddlewares(ctx, this.controller)).reduce((p, c) => p.concat(c), [])
                .concat(middlewares)
                .concat(auths.map(a => a.getAuthMiddlewares(ctx, this.controller, meta.propertyKey)).reduce((p, c) => p.concat(c), []));
        }
        if (meta.middlewares) {
            middlewares = middlewares.concat(meta.middlewares);
        }
        return middlewares;
    }

    async options(ctx: IContext, next: () => Promise<void>): Promise<void> {
        let requestOrigin = ctx.get('Origin');
        ctx.vary('Origin');
        if (!requestOrigin) {
            return await next();
        }

        let config = ctx.mvcContext.getConfiguration();
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
                await next();
            } catch (err) {
                const errHeadersSet = err.headers || {};
                const varyWithOrigin = vary.append(errHeadersSet.vary || errHeadersSet.Vary || '', 'Origin');
                delete errHeadersSet.Vary;

                err.headers = {
                    ...errHeadersSet,
                    ...headersSet,
                    ...{ vary: varyWithOrigin },
                };

                ctx.status = err instanceof HttpError ? err.status || 500 : 500;
                ctx.message = err.message || err.toString() || '';
                ctx.mvcContext.getLogManager()?.getLogger()?.error(err);
            };
        } else {
            const coremeta = this.getCorsMeta(ctx, ctx.get('Access-Control-Request-Method'));
            if (!coremeta) {
                ctx.status = 403;
                return await next();
            }
            options = { ...options, ...coremeta };
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

    async invoke(ctx: IContext, meta: RouteMetadata) {
        let injector = ctx.mvcContext.injector;
        if (meta && meta.propertyKey) {
            let ctrl = injector.getInstance(this.controller, { provide: ContextToken, useValue: ctx });
            let reflects = ctx.mvcContext.reflects;
            let providers = await this.createProvider(ctx, ctrl, meta, reflects.getParameters(this.controller, ctrl, meta.propertyKey));
            let result = await injector.invoke(ctrl, meta.propertyKey, ...providers);
            if (isPromise(result)) {
                result = await result;
            }

            // middleware.
            if (isFunction(result)) {
                await result(ctx);
            } else if (result instanceof MvcMiddleware || result instanceof MvcMiddlewares) {
                await result.execute(ctx, emptyNext);
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
                ctx.status = 200;
            } else if (isObject(result)) {
                if (result instanceof ResultValue) {
                    await result.sendValue(ctx);
                } else {
                    ctx.body = result;
                    ctx.status = 200;
                }
            } else {
                ctx.body = result;
                ctx.status = 200;
            }
        }
    }

    protected async createProvider(ctx: IContext, ctrl: any, meta: RouteMetadata, params: IParameter[]): Promise<Provider[]> {
        let injector = ctx.getInjector();
        let providers: Provider[] = [{ provide: ContextToken, useValue: ctx }];
        if (params && params.length) {
            let restParams: any = {};
            if (this.isRestUri(meta.route)) {
                let routes = meta.route.split('/').map(r => r.trim());
                let restParamNames = routes.filter(d => restParms.test(d));
                let baseURL = this.vaildify(this.url, true);
                let routeUrls = this.vaildify(ctx.url.replace(baseURL, '')).split('/');
                restParamNames.forEach(pname => {
                    let val = routeUrls[routes.indexOf(pname)];
                    restParams[pname.substring(1)] = val;
                });
            }
            let body = ctx.request.body || {};
            let parser = injector.get(BaseTypeParserToken);
            let ppds: Provider[] = await Promise.all(params.map(async (param) => {
                let ptype = param.provider ? injector.getTokenProvider(param.provider) : param.type;
                let val;
                if (isFunction(ptype)) {
                    if (isBaseType(ptype)) {
                        let paramVal = restParams[param.name];
                        if (isUndefined(paramVal)) {
                            paramVal = ctx.request.query[param.name];
                        }
                        val = parser.parse(ptype, paramVal);
                    }
                    if (isNullOrUndefined(val) && lang.hasField(body)) {
                        if (isArray(ptype) && isArray(body)) {
                            val = body;
                        } else if (isBaseType(ptype)) {
                            val = parser.parse(ptype, body[param.name]);
                        } else if (isClass(ptype)) {
                            let mdparser = injector.getService({ token: ModelParser, target: [ptype, ...ctx.mvcContext.reflects.getDecorators(ptype)], defaultToken: DefaultModelParserToken });
                            if (mdparser) {
                                val = mdparser.parseModel(ptype, body);
                            } else {
                                val = await injector.getInstance(BuilderServiceToken).resolve({ type: ptype, template: body })
                            }
                        }
                    }
                }

                if (isNullOrUndefined(val)) {
                    return null;
                }
                return { provide: param.name || ptype, useValue: val };
            }))
            providers = providers.concat(ppds.filter(p => p !== null));
        }

        return providers;
    }

    protected isRestUri(uri: string) {
        return isRest.test(uri || '');
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
