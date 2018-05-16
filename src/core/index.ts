export * from './IAuthorization';
export * from './RequestMethod';
export * from './IContext';
export * from './metadata';
export * from './decorators';
export * from './middlewares';
export * from './results';
export * from './router';
export * from './Application';
export * from './BaseController';

import {
    DefaultLogMiddleware, DefaultContextMiddleware,
    DefaultContentMiddleware, DefaultSessionMiddleware,
    DefaultBodyParserMiddleware,
    DefaultCorsMiddleware,
    DefaultViewsMiddleware,
    DefaultJsonMiddleware

} from './middlewares/index';
import { IContainer, CoreActions, LifeState } from '@ts-ioc/core';
import { Router, ModelParser } from './router/index';
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

export function registerDefaultMiddlewars(container: IContainer) {
    container.register(DefaultContentMiddleware);
    container.register(DefaultContextMiddleware);
    container.register(DefaultJsonMiddleware);
    container.register(DefaultLogMiddleware);
    container.register(DefaultSessionMiddleware);
    container.register(DefaultBodyParserMiddleware);
    container.register(DefaultViewsMiddleware);
    container.register(DefaultCorsMiddleware);
    container.register(Router);
}
