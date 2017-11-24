import { NullComponent, IComponent, IContainer } from 'type-autofac';
import { IRoute } from './IRoute';
import { IContext } from '../IContext';



export class NotFoundRoute extends NullComponent implements IRoute {
    math(ctx: IContext): IRoute {
        return notFoundRoute;
    }
    naviage(container: IContainer, ctx: IContext, next: () => Promise<any>) {
        return next();
    }
    empty(): IComponent {
        return notFoundRoute;
    }
}

export const notFoundRoute = new NotFoundRoute();
