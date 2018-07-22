export * from './IAuthorization';
export * from './RequestMethod';
export * from './IContext';
export * from './metadata/index';
export * from './decorators/index';
export * from './middlewares/index';
export * from './results/index';
export * from './router/index';
export * from './servers/index';
export * from './Application';
export * from './BaseController'
export * from './IApplication';

import { IContainer, CoreActions, LifeState } from '@ts-ioc/core';
import { ModelParser } from './router/index';
import { BaseController } from './BaseController';
import { Controller, Authorization, Middleware, Model } from './decorators/index';

export function registerDefaults(container: IContainer) {
    let lifeScope = container.getLifeScope();
    lifeScope.registerDecorator(Controller, LifeState.onInit, CoreActions.bindProvider);
    lifeScope.registerDecorator(Authorization, LifeState.onInit, CoreActions.bindProvider);
    lifeScope.registerDecorator(Middleware, LifeState.onInit, CoreActions.bindProvider);
    lifeScope.registerDecorator(Model, LifeState.onInit, CoreActions.bindProvider);
    container.register(ModelParser);
    container.register(BaseController);
}

