import { IocExt, ContainerToken, IContainer } from '@tsdi/core';
import { Controller, Authorization, Middleware } from './decorators';
import { Inject } from '@tsdi/ioc';


@IocExt('setup')
export class MvcCoreModule {

    constructor(@Inject(ContainerToken) private container: IContainer) {

    }

    setup() {
        let lifeScope = this.container.getLifeScope();
        lifeScope.registerDecorator(Controller, LifeState.onInit, CoreActions.bindProvider);
        lifeScope.registerDecorator(Authorization, LifeState.onInit, CoreActions.bindProvider);
        lifeScope.registerDecorator(Middleware, LifeState.onInit, CoreActions.bindProvider);
    }
}
