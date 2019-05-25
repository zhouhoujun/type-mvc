import { Route, RouteUrlToken } from './Route';
import { IContext } from '../middlewares';
import { Injectable, Inject, InjectToken } from '@tsdi/ioc';
import { HandleType } from '@tsdi/boot';

export const CustomHandleToken = new InjectToken<HandleType<IContext>>('custom_route_handle');

@Injectable
export class CustomRoute extends Route {


    constructor(@Inject(RouteUrlToken) url: string, @Inject(CustomHandleToken) protected handle: HandleType<IContext>) {
        super(url)
    }

    async navigate(ctx: IContext, next: () => Promise<void>): Promise<void> {
        await this.parseAction(this.handle)(ctx, next);
    }
}
