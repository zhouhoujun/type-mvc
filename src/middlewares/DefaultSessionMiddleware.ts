import { IContainer, Injectable, Inject } from 'type-autofac';
import { Middleware } from '../decorators';
import { IMiddleware } from './IMiddleware';
import { Application } from '../Application';
import { ContextSymbol, SessionMiddleware } from '../util';


@Middleware(SessionMiddleware)
export class DefaultSessionMiddleware implements IMiddleware {

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
