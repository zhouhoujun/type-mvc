import { BaseRoute } from './BaseRoute';
import { Type, IContainer, getMethodMetadata } from 'type-autofac';
import { IContext } from '../IContext';
import { Next } from '../util';
import { Get, GetMetadata, RouteMetadata } from '../decorators';
import { IRoute } from './IRoute';
import { Authorization } from '../index';


export class ControllerRoute extends BaseRoute {

    constructor(route: string, private controller: Type<any>) {
        super(route);
    }

    async navigate(container: IContainer, ctx: IContext) {
        let ctrl = container.get(this.controller);
        console.log('navigate controller', ctrl);
        let requrl = ctx.url;
        let routMethod = '';
        if (this.url !== requrl) {
            routMethod = requrl.substr(requrl.lastIndexOf('/'));
        }
        switch (ctx.method) {
            case 'GET':
                let allGets = getMethodMetadata<RouteMetadata>(this.controller, Get);
                console.log('Get', allGets);
                let meta;
                for (let name in allGets) {
                    if (meta) {
                        break;
                    }
                    meta = allGets[name].find(route => route.route === routMethod);
                }
                if (meta && meta.propertyKey) {
                    let hasAuth = Reflect.hasMetadata(Authorization.toString(), ctrl, meta.propertyKey);
                    container.execMethod(meta.propertyKey, this.controller, ctrl);
                } else {
                    let notFound = this.empty() as IRoute;
                    return await notFound.navigate(container, ctx);
                }
                break;

        }
    }
}
