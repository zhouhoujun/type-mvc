import { IContainer, Injectable, Inject } from '@ts-ioc/core';
import { Middleware } from '../decorators';
import { IMiddleware } from './IMiddleware';
import { Application } from '../Application';
import { NonePointcut } from '@ts-ioc/aop';


@Middleware(MvcSymbols.ContextMiddleware)
export class DefaultContextMiddleware implements IMiddleware {

    @Inject(MvcSymbols.Application)
    private app: Application;

    constructor() {
    }

    setup() {
        this.app.use(async (ctx, next) => {
            this.app.container.unregister(MvcSymbols.IContext);
            this.app.container.bindProvider(MvcSymbols.IContext, () => ctx);
            return next();
        });
    }

}
