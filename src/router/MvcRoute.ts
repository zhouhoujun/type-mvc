import { IComponent, Composite, Type, IContainer } from 'type-autofac';
import { Context } from 'koa';
import { KoaNext } from '../util';





export interface IRoute extends IComponent {
    math(ctx: Context): IRoute;
    naviage(container: IContainer, ctx: Context, next: KoaNext);
}


export class MvcRoute extends Composite implements IRoute {
    constructor(route: string, private controller?: Type<any>) {
        super(route);
    }

    math(ctx: Context) {
        return this.find(r => {
            return r.name === ctx.req.url
        }) as IRoute;
    }

    naviage(container: IContainer, ctx: Context, next: KoaNext) {
        container.get(this.controller);
    }

}
