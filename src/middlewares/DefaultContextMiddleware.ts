import { IContainer, Injectable, Inject } from 'type-autofac';
import { Middleware } from '../decorators';
import { IMiddleware } from './IMiddleware';
import { Application } from '../Application';
import { ContextSymbol, ContextMiddleware } from '../util';


@Middleware(ContextMiddleware)
export class DefaultContextMiddleware implements IMiddleware {

    constructor(private app: Application) {
    }
    setup() {
        this.app.use(async (ctx, next) => {
            this.app.container.unregister(ContextSymbol);
            this.app.container.bindProvider(ContextSymbol, () => ctx);
            return next();
        });
    }

}
