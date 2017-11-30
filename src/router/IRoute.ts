import { IComponent, IContainer } from 'tsioc';
import { IContext } from '../IContext';
import { Next } from '../index';


export interface RouteAction {
    (ctx: IContext, next: Next): Promise<any>;
}

export interface IRoute extends IComponent {
    url: string;
    match(ctx: IContext | string): IRoute;

    navigating(container: IContainer, ctx: IContext): Promise<any>
}
