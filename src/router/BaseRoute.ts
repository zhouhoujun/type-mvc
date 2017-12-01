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
export abstract class BaseRoute extends Composite implements IRoute {
    url: string;
    constructor(route: string) {
        super(route);
        this.url = route.substr(0);
    }

    add(node: IRoute): IRoute {
        // if (this.url.indexOf(node.url) === 0) {
        //     super.add(node);
        // } else if (node.url.indexOf(this.url) === 0) {
        //     let parent = this.parent;
        //     let child = this;
        //     if (parent) {
        //         node.parent = parent;
        //         parent.add(node);
        //     }
        //     child.parent = node;
        //     node.add(child);
        // } else {
        //     node.url = this.url + node.url;
        //     super.add(node);
        // }
        // return this;
        node.url = this.url + node.url;
        super.add(node)
        return this;
    }

    match(ctx: IContext | string) {
        let prefix: string = isString(ctx) ? ctx : ctx.url;
        let route = this.find((r: IRoute) => {
            console.log('r', r.url, 'prefix:', prefix);
            return  r.url && prefix && prefix.indexOf(r.url) === 0;
        });
        return route;
    }

    abstract async navigating(container: IContainer, ctx: IContext): Promise<any>;
    empty(): IComponent {
        return notFoundRoute;
    }

}
