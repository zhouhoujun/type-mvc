import { NullComponent, IComponent, IContainer } from '@ts-ioc/core';
import { IRoute } from './IRoute';
import { IContext } from '../IContext';
import { NotFoundError } from '../../errors/index';
import { Next } from '../../util/index';



export class NotFoundRoute extends NullComponent implements IRoute {
    name: string;
    url: string;
    match(ctx: IContext): IRoute {
        return notFoundRoute as IRoute;
    }

    async options(container: IContainer, ctx: IContext, next: Next) {
        return next();
    }
    async navigating(container: IContainer, ctx: IContext, next: Next) {
        return next();
    }

    empty(): IRoute {
        return notFoundRoute;
    }
}

export const notFoundRoute = new NotFoundRoute();
