import { IContainer, Injectable, Inject } from 'type-autofac';
import { Middleware } from '../decorators';
import { IMiddleware } from './IMiddleware';
import { Application } from '../Application';
import { ContextName } from '../util';


@Middleware
export class ContextMiddleware implements IMiddleware {

    constructor(private app: Application) {

    }

    setup() {
        this.app.use(async (ctx) => {
            this.app.container.unregister(ContextName);
            this.app.container.register(ContextName, () => ctx);
        });
    }

}
