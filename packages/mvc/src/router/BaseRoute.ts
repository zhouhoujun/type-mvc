import { GComposite, IContainer, Mode, isString } from '@ts-ioc/core';
import { IRoute } from './IRoute';
import { notFoundRoute } from './NotFoundRoute';
import { IContext } from '../IContext';
import { Next } from '../util';


/**
 * base route.
 *
 * @export
 * @class BaseRoute
 * @extends {Composite}
 * @implements {IRoute}
 */
export abstract class BaseRoute extends GComposite<IRoute> implements IRoute {
    url: string;
    constructor(route: string) {
        super(route);
        this.url = route.substring(0);
    }

    add(node: IRoute): this {
        let baseUrl = this.cutEmptyPath(this.url, true);

        node.url = baseUrl + node.url;
        super.add(node)
        return this;
    }

    cutEmptyPath(routPath: string, foreNull = false): string {
        if (foreNull && routPath === '/') {
            return '';
        }
        if (/\/\s*$/.test(routPath)) {
            routPath = routPath.substring(0, routPath.lastIndexOf('/'));
        }
        if (/\?\S*$/.test(routPath)) {
            routPath = routPath.substring(0, routPath.lastIndexOf('?'));
        }
        return routPath;
    }

    match(ctx: IContext | string) {
        let prefix: string = isString(ctx) ? ctx : ctx.url;
        let route = this.find((r: IRoute) => {
            return r.url && prefix && prefix.indexOf(r.url) === 0;
        }, Mode.traverseLast);
        return route;
    }

    abstract async options(container: IContainer, ctx: IContext, next: Next): Promise<any>;
    abstract async navigating(container: IContainer, ctx: IContext, next: Next): Promise<any>;
    empty(): IRoute {
        return notFoundRoute;
    }

}
