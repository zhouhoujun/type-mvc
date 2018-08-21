import { IocExt, IContainer, Inject, ContainerToken } from '@ts-ioc/core';
import * as routes from './route';
import * as middlewares from './middlewares';

@IocExt('setup')
export class RouterModule {

    @Inject(ContainerToken)
    private container: IContainer;

    constructor() {

    }

    setup() {
        this.container.use(routes, middlewares);
    }
}
