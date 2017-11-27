import { IComponent, IContainer } from 'type-autofac';
import { IContext } from '../IContext';
import { Next } from '../index';


export interface RouteAction {
    (ctx: IContext, next: Next): Promise<any>;
}

export interface IRoute extends IComponent {
    url: string;
    match(ctx: IContext | string): IRoute;

    navigate(container: IContainer, ctx: IContext);
}
