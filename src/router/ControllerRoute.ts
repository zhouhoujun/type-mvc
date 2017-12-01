import { BaseRoute } from './BaseRoute';
import { Type, IContainer, getMethodMetadata, AsyncParamProvider, Token } from 'tsioc';
import { IContext } from '../IContext';
import { Next } from '../util';
import { Get, GetMetadata, RouteMetadata } from '../decorators';
import { IRoute } from './IRoute';
import { Authorization } from '../decorators';
import { symbols } from '../util';
import { IAuthorization } from '../auth';
import { UnauthorizedError, NotFoundError, HttpError, BadRequestError } from '../errors/index';


export class ControllerRoute extends BaseRoute {

    constructor(route: string, private controller: Type<any>) {
        super(route);
    }

    async navigating(container: IContainer, ctx: IContext): Promise<any> {

        let requrl = ctx.url;
        let routPath = '';
        if (this.url !== requrl) {
            routPath = requrl.substr(requrl.lastIndexOf('/'));
        }
        let respone;
        try {
            switch (ctx.method) {
                case 'GET':
                    respone = await this.invoke(container, Get, routPath, (meta: RouteMetadata, params: Token<any>[], ctrl) => this.createGetProvider(meta, params, ctrl, ctx));
                    break;
                case 'POST':
                    respone = await this.invoke(container, Get, routPath, (meta: RouteMetadata, params: Token<any>[], ctrl) => this.createPostProvider(meta, params, ctrl, ctx));
                    break;
                case 'Put':
                    respone = await this.invoke(container, Get, routPath, (meta: RouteMetadata, params: Token<any>[], ctrl) => this.createPutProvider(meta, params, ctrl, ctx));
                    break;
                case 'DElETE':
                    respone = await this.invoke(container, Get, routPath, (meta: RouteMetadata, params: Token<any>[], ctrl) => this.createDeleteProvider(meta, params, ctrl, ctx));
                    break;
            }
            ctx.body = respone;
        } catch (err) {
            if (err instanceof HttpError) {
                ctx.status = err.code;
                ctx.response.status = err.code;
                ctx.response.message = err.message;
            }
            console.log(err.toString());
        }
    }

    createProvider(meta: RouteMetadata, params: Token<any>[], ctrl: any, ctx: IContext): AsyncParamProvider[] {
        return []
    }

    createGetProvider(meta: RouteMetadata, params: Token<any>[], ctrl: any, ctx: IContext): AsyncParamProvider[] {
        if (params && params.length) {
            if (this.isRestUri(meta.route)) {
                let url = meta.route.substr(0, meta.route.indexOf('/:')) + '/';
                let querystring = ctx.url.replace(url, '');
                let restParam = querystring.substr(0, querystring.indexOf('/'));
                
            }
        }
        return []
    }

    createPostProvider(meta: RouteMetadata, params: Token<any>[], ctrl: any, ctx: IContext): AsyncParamProvider[] {
        return []
    }

    createPutProvider(meta: RouteMetadata, params: Token<any>[], ctrl: any, ctx: IContext): AsyncParamProvider[] {
        return []
    }

    createDeleteProvider(meta: RouteMetadata, params: Token<any>[], ctrl: any, ctx: IContext): AsyncParamProvider[] {
        return []
    }

    protected isRestUri(uri: string) {
        return /\/:/.test(uri || '');
    }

    async invoke(container: IContainer, decorator: Function, routPath: string, provider: (meta: RouteMetadata, params: Token<any>[], ctrl: any) => AsyncParamProvider[]) {
        let decoratorName = decorator.toString();
        let allMethods = getMethodMetadata<RouteMetadata>(decoratorName, this.controller);
        let meta;
        for (let name in allMethods) {
            if (meta) {
                break;
            }
            meta = allMethods[name].find(route => {
                let uri = route.route || '';
                if (uri === routPath) {
                    return true;
                }
                if (this.isRestUri(uri)) {
                    let url = uri.substr(0, uri.indexOf('/:'));
                    if (url !== routPath && routPath.indexOf(url) === 0) {
                        return true;
                    }
                }
                return false;
            });
        }
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
            return container.invoke(this.controller, meta.propertyKey, ctrl, ...provider(meta, params, ctrl));
        } else {
            throw new NotFoundError();
        }
    }
}
