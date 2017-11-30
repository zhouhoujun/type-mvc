import { BaseRoute } from './BaseRoute';
import { Type, IContainer, getMethodMetadata, AsyncParamProvider } from 'tsioc';
import { IContext } from '../IContext';
import { Next } from '../util';
import { Get, GetMetadata, RouteMetadata } from '../decorators';
import { IRoute } from './IRoute';
import { Authorization } from '../decorators';
import { symbols } from '../util';
import { IAuthorization } from '../auth';
import { UnauthorizedError, NotFoundError } from '../errors/index';


export class ControllerRoute extends BaseRoute {

    constructor(route: string, private controller: Type<any>) {
        super(route);
    }

    async navigate(container: IContainer, ctx: IContext): Promise<any> {

        let requrl = ctx.url;
        let routMethod = '';
        if (this.url !== requrl) {
            routMethod = requrl.substr(requrl.lastIndexOf('/'));
        }
        switch (ctx.method) {
            case 'GET':
                return this.invoke(container, Get, routMethod, (ctrl) => this.createGetProvider(ctrl, ctx));
            case 'POST':
                return this.invoke(container, Get, routMethod, (ctrl) => this.createPostProvider(ctrl, ctx));
            case 'Put':
                return this.invoke(container, Get, routMethod, (ctrl) => this.createPutProvider(ctrl, ctx));
            case 'DElETE':
                return this.invoke(container, Get, routMethod, (ctrl) => this.createDeleteProvider(ctrl, ctx));

        }
    }

    createProvider(ctrl: any, ctx: IContext): AsyncParamProvider[] {
        return []
    }

    createGetProvider(ctrl: any, ctx: IContext): AsyncParamProvider[] {
        return []
    }

    createPostProvider(ctrl: any, ctx: IContext): AsyncParamProvider[] {
        return []
    }

    createPutProvider(ctrl: any, ctx: IContext): AsyncParamProvider[] {
        return []
    }

    createDeleteProvider(ctrl: any, ctx: IContext): AsyncParamProvider[] {
        return []
    }

    async invoke(container: IContainer, decorator: Function, routMethod: string, provider: (ctrl: any) => AsyncParamProvider[]) {
        let allMethods = getMethodMetadata<RouteMetadata>(Get, this.controller);
        console.log(decorator.toString(), allMethods);
        let meta;
        for (let name in allMethods) {
            if (meta) {
                break;
            }
            meta = allMethods[name].find(route => route.route === routMethod);
        }
        if (meta && meta.propertyKey) {
            let ctrl = container.get(this.controller);
            if (container.has(symbols.IAuthorization)) {
                let hasAuth = Reflect.hasMetadata(Authorization.toString(), ctrl, meta.propertyKey);
                if (hasAuth) {
                    let auth = container.get<IAuthorization>(symbols.IAuthorization);
                    if (!auth.isAuth()) {
                        return Promise.reject(new UnauthorizedError());
                    }
                }
            }
            return container.invoke(this.controller, meta.propertyKey, ctrl, ...provider(ctrl));
        } else {
            return Promise.reject(new NotFoundError());
        }
    }
}
