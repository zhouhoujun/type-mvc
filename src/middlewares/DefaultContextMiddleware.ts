import { IContainer, Injectable, Inject } from 'tsioc';
import { Middleware } from '../decorators';
import { IMiddleware } from './IMiddleware';
import { Application } from '../Application';
import { symbols } from '../util';


@Middleware(symbols.ContextMiddleware)
export class DefaultContextMiddleware implements IMiddleware {

    constructor(private app: Application) {
    }
    setup() {
        this.app.use(async (ctx, next) => {
            this.app.container.unregister(symbols.IContext);
            this.app.container.bindProvider(symbols.IContext, () => ctx);
            return next();
        });
    }

}
