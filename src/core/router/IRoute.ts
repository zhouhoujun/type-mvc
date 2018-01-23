import { GComponent, IContainer } from 'tsioc';
import { IContext } from '../IContext';
import { Next } from '../../util';


export interface RouteAction {
    (ctx: IContext, next: Next): Promise<any>;
}

export interface IRoute extends GComponent<IRoute> {
    url: string;
    match(ctx: IContext | string): IRoute;
    options(container: IContainer, ctx: IContext, next: Next): Promise<any>;
    navigating(container: IContainer, ctx: IContext, next: Next): Promise<any>;
}
