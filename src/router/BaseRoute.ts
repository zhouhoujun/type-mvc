import { IComponent, Composite, Type, IContainer } from 'tsioc';
import { IContext } from '../IContext';
import { Next } from '../util';
import { IRoute, RouteAction } from './IRoute';
import { notFoundRoute } from './NotFoundRoute';
import { isString } from 'util';


/**
 * base route.
 *
 * @export
 * @class BaseRoute
 * @extends {Composite}
 * @implements {IRoute}
 */
export class BaseRoute extends Composite implements IRoute {
    url: string;
    constructor(route: string) {
        super(route);
        this.url = route.toString();
    }

    add(node: IRoute): IRoute {
        if (this.url.indexOf(node.url) === 0) {
            super.add(node);
        } else if (node.url.indexOf(this.url) === 0) {
            let parent = this.parent;
            let child = this;
            if (parent) {
                node.parent = parent;
                parent.add(node);
            }
            child.parent = node;
            node.add(child);
        } else {
            node.url = this.url + node.url;
            super.add(node);
        }
        return this;
    }

    match(ctx: IContext | string) {
        let express;
        let prefix: string;
        if (isString(ctx)) {
            prefix = ctx;
            prefix.substr(0, prefix.lastIndexOf('/'))
            express = r => {
                return r.url === prefix
            };
        } else {
            prefix = ctx.req.url;
            prefix.substr(0, prefix.lastIndexOf('/'))
            express = r => {
                return r.url === prefix
            }
        }
        let route = this.find(express) as IRoute;
        console.log('match route', route);
        return route;
    }

    async navigate(container: IContainer, ctx: IContext) {

    }
    empty(): IComponent {
        return notFoundRoute;
    }

}
