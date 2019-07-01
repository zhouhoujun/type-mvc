import { MvcRoute, RouteUrlArgToken } from './Route';
import { IContext } from '../IContext';
import { Injectable, Inject, InjectToken } from '@tsdi/ioc';
import { HandleType } from '@tsdi/boot';

export const CustomHandleArgToken = new InjectToken<HandleType<IContext>>('custom_route_handle');

@Injectable
export class CustomRoute extends MvcRoute {

    constructor(@Inject(RouteUrlArgToken) url: string, @Inject(CustomHandleArgToken) protected handle: HandleType<IContext>) {
        super(url)
    }

    async navigate(ctx: IContext, next: () => Promise<void>): Promise<void> {
        await this.parseAction(this.handle)(ctx, next);
    }
}
