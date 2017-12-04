import { NullComponent, IComponent, IContainer } from 'tsioc';
import { IRoute } from './IRoute';
import { IContext } from '../IContext';
import { NotFoundError } from '../errors/index';
import { Next } from '../util';



export class NotFoundRoute extends NullComponent implements IRoute {
    name: string;
    url: string;
    parent?: IComponent;
    match(ctx: IContext): IRoute {
        return notFoundRoute;
    }

    async options(container: IContainer, ctx: IContext, next: Next) {
        return next();
    }
    async navigating(container: IContainer, ctx: IContext) {

    }

    empty(): IComponent {
        return notFoundRoute;
    }
}

export const notFoundRoute = new NotFoundRoute();
