import { NullComponent, IComponent, IContainer } from 'tsioc';
import { IRoute } from './IRoute';
import { IContext } from '../IContext';



export class NotFoundRoute extends NullComponent implements IRoute {
    name: string;
    url: string;
    parent?: IComponent;
    match(ctx: IContext): IRoute {
        return notFoundRoute;
    }
    async  navigate(container: IContainer, ctx: IContext) {
        throw 'not found test';
    }
    empty(): IComponent {
        return notFoundRoute;
    }
}

export const notFoundRoute = new NotFoundRoute();
