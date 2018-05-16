import { IContainer, Injectable, Inject } from '@ts-ioc/core';
import { Middleware } from '../decorators';
import { IMiddleware, ContextMiddlewareToken } from './IMiddleware';
import { Application, ApplicationToken } from '../Application';
import { NonePointcut } from '@ts-ioc/aop';
import { ContextToken } from '../IContext';


@Middleware(ContextMiddlewareToken)
export class DefaultContextMiddleware implements IMiddleware {

    @Inject(ApplicationToken)
    private app: Application;

    constructor() {
    }

    setup() {
        this.app.use(async (ctx, next) => {
            this.app.container.unregister(ContextToken);
            this.app.container.bindProvider(ContextToken, () => ctx);
            return next();
        });
    }

}
