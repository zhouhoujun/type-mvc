import { BaseRoute } from './BaseRoute';
import { Type, IContainer, getMethodMetadata, AsyncParamProvider, Token, isToken, Container, isClass, isFunction } from 'tsioc';
import { IContext } from '../IContext';
import { Next } from '../util';
import { Get, GetMetadata, RouteMetadata, Post, Put, Delete } from '../decorators';
import { IRoute } from './IRoute';
import { Authorization } from '../decorators';
import { symbols } from '../util';
import { IAuthorization } from '../auth';
import { UnauthorizedError, NotFoundError, HttpError, BadRequestError } from '../errors/index';
import { isUndefined, isBoolean, isString, isObject, isArray } from 'util';
import { JsonResult } from '../restults/JsonResult';
import { ViewResult } from '../restults/ViewResult';
import { FileResult } from '../restults/FileResult';


export class ControllerRoute extends BaseRoute {

    constructor(route: string, private controller: Type<any>) {
        super(route);
    }

    async navigating(container: IContainer, ctx: IContext): Promise<any> {
        try {
            switch (ctx.method) {
                case 'GET':
                    await this.invoke(ctx, container, Get, (meta: RouteMetadata, params: Token<any>[], ctrl) => this.createProvider(container, meta, params, ctrl, ctx));
                    break;
                case 'POST':
                    await this.invoke(ctx, container, Post, (meta: RouteMetadata, params: Token<any>[], ctrl) => this.createProvider(container, meta, params, ctrl, ctx));
                    break;
                case 'Put':
                    await this.invoke(ctx, container, Put, (meta: RouteMetadata, params: Token<any>[], ctrl) => this.createProvider(container, meta, params, ctrl, ctx));
                    break;
                case 'DElETE':
                    await this.invoke(ctx, container, Delete, (meta: RouteMetadata, params: Token<any>[], ctrl) => this.createProvider(container, meta, params, ctrl, ctx));
                    break;
            }
        } catch (err) {
            if (err instanceof HttpError) {
                ctx.status = err.code;
                ctx.response.status = err.code;
                ctx.response.message = err.message;
            }
            console.log(err.toString());
        }
    }

    createProvider(container: IContainer, meta: RouteMetadata, params: Token<any>[], ctrl: any, ctx: IContext): AsyncParamProvider[] {
        if (params && params.length) {
            if (this.isRestUri(meta.route)) {
                let url = meta.route.substr(0, meta.route.indexOf('/:')) + '/';
                let querystring = ctx.url.replace(this.url + url, '');
                let paramVal = querystring.indexOf('/') > 0 ? querystring.substr(0, querystring.indexOf('/')) : querystring;
                let body = ctx.request['body'] || {};
                let providers = params.map((p, idx) => {
                    try {
                        if (!this.isBaseType(p)) {
                            let val = container.get(p);
                            for (let n in val) {
                                if (!isUndefined(body[n])) {
                                    val[n] = body[n];
                                }
                            }
                            return {
                                value: val,
                                index: idx
                            }

                        } else {
                            let val;
                            if (paramVal !== null) {
                                if (p === String) {
                                    val = paramVal;
                                } else if (p === Boolean) {
                                    val = new Boolean(paramVal);
                                } else if (p === Number) {
                                    val = parseFloat(paramVal);
                                } else if (p === Date) {
                                    val = new Date(paramVal);
                                }
                                paramVal = null;
                            }
                            return {
                                value: val,
                                index: idx
                            }
                        }
                    } catch (err) {
                        throw new BadRequestError(err.toString());
                    }
                });
                return providers;
            }
        }
        return [];
    }

    isBaseType(p) {
        if (!isToken(p)) {
            return true;
        }

        if (p === Boolean || p === String || p === Number) {
            return true;
        }

        if (!isFunction(p)) {
            return true;
        }

        return false;

    }


    protected isRestUri(uri: string) {
        return /\/:/.test(uri || '');
    }

    async invoke(ctx: IContext, container: IContainer, decorator: Function, provider: (meta: RouteMetadata, params: Token<any>[], ctrl: any) => AsyncParamProvider[]) {
        let decoratorName = decorator.toString();
        let routPath = this.cutEmptyPath(ctx.url.replace(this.url, ''));
        let methodMaps = getMethodMetadata<RouteMetadata>(decoratorName, this.controller);
        let meta: RouteMetadata;

        let allMethods: RouteMetadata[] = [];
        for (let name in methodMaps) {
            allMethods = allMethods.concat(methodMaps[name]);
        }
        allMethods = allMethods.sort((ra, rb) => (rb.route || '').length - (ra.route || '').length);

        meta = allMethods.find(route => {
            let uri = route.route || '';

            if (uri === routPath) {
                return true;
            }
            if (this.isRestUri(uri)) {
                let idex = uri.indexOf('/:');
                let url = uri.substr(0, idex);
                if (url !== routPath && routPath.indexOf(url) === 0) {
                    return true;
                }
            }
            return false;
        });

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
                if (response instanceof JsonResult) {
                    await response.sendValue(ctx, container);
                } else if (response instanceof ViewResult) {
                    await response.sendValue(ctx, container);
                } else if (response instanceof FileResult) {
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
}
