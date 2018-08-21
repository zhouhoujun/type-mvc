import { IocExt, Inject, ContainerToken, IContainer } from '@ts-ioc/core';
import * as Koa from 'koa';
import * as middlewares from './middlewares';
import { CoreServerToken } from '@mvx/mvc';

@IocExt('setup')
export class KoaModule {
    @Inject(ContainerToken)
    private container: IContainer;

    setup() {
        this.container.use(middlewares);
        this.container.bindProvider(CoreServerToken, () => new Koa());
    }
}
