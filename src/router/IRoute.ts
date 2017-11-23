import { IComponent, IContainer } from 'type-autofac';
import { IContext } from '../IContext';
import { Next } from '../index';


export interface RouteAction {
    (ctx: IContext, next: Next): Promise<any>;
}

export interface IRoute extends IComponent {
    math(ctx: IContext): IRoute;
    naviage(container: IContainer, ctx: IContext, next: Next);
}
