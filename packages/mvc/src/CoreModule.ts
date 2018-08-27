import { IocExt, ContainerToken, Inject, IContainer, LifeState, CoreActions } from '@ts-ioc/core';
import { BaseController } from './BaseController';
import { Controller, Authorization, Middleware, Model } from './decorators';
import { ModelParser } from './model';
import { AppBuilder } from './AppBuilder';
import { AppModuleBuilder } from './AppModuleBuilder';
import { Application } from './Application';
import { MiddlewareChain } from './middlewares';
import { Configuration } from './Configuration';
import { CorsMiddleware } from './router';

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
        this.container.use(Configuration, ModelParser, BaseController, AppBuilder, AppModuleBuilder, Application, MiddlewareChain, CorsMiddleware);
    }
}
