import { IContainer, Injectable, Inject } from '@ts-ioc/core';
import { Middleware } from '../decorators';
import { IMiddleware } from './IMiddleware';
import { Application } from '../Application';
import { mvcSymbols } from '../../util/index';
import { NonePointcut } from '@ts-ioc/aop';


@NonePointcut
@Middleware(mvcSymbols.ContextMiddleware)
export class DefaultContextMiddleware implements IMiddleware {

    constructor(private app: Application) {
    }
    setup() {
        this.app.use(async (ctx, next) => {
            this.app.container.unregister(mvcSymbols.IContext);
            this.app.container.bindProvider(mvcSymbols.IContext, () => ctx);
            return next();
        });
    }

}
