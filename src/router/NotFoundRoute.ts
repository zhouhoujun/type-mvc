import { NullComponent, IComponent, IContainer } from 'tsioc';
import { IRoute } from './IRoute';
import { IContext } from '../IContext';
import { NotFoundError } from '../errors/index';



export class NotFoundRoute extends NullComponent implements IRoute {
    name: string;
    url: string;
    parent?: IComponent;
    match(ctx: IContext): IRoute {
        return notFoundRoute;
    }
    async navigating(container: IContainer, ctx: IContext) {
        return new NotFoundError();
    }
    empty(): IComponent {
        return notFoundRoute;
    }
}

export const notFoundRoute = new NotFoundRoute();
