import { IocExt, ContainerToken, Inject, IContainer, LifeState, CoreActions } from '@ts-ioc/core';
import { Controller, Authorization, Middleware, Model } from './decorators';
import * as injectors from './injectors';
import * as modles from './model';
import { Application } from './Application';

@IocExt('setup')
export class CoreModule {

    constructor(@Inject(ContainerToken) private container: IContainer) {

    }

    setup() {
        let lifeScope = this.container.getLifeScope();
        lifeScope.registerDecorator(Controller, LifeState.onInit, CoreActions.bindProvider);
        lifeScope.registerDecorator(Authorization, LifeState.onInit, CoreActions.bindProvider);
        lifeScope.registerDecorator(Middleware, LifeState.onInit, CoreActions.bindProvider);
        lifeScope.registerDecorator(Model, LifeState.onInit, CoreActions.bindProvider);
        this.container
            .use(modles, injectors)
            .register(Application);
    }
}
