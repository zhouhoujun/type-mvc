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

} from './middlewares';
import { IContainer, CoreActions } from 'tsioc';
import { symbols } from '../util';
import { Router, ModelParser } from './router';
import { BaseController } from './BaseController';
import { Controller, Authorization, Middleware, Model } from './decorators';
import { Configuration } from '../Configuration';

export function registerDefaults(container: IContainer) {
    let lifeScope = container.getLifeScope();
    lifeScope.registerDecorator(Controller, CoreActions.bindProvider);
    lifeScope.registerDecorator(Authorization, CoreActions.bindProvider);
    lifeScope.registerDecorator(Middleware, CoreActions.bindProvider);
    lifeScope.registerDecorator(Model, CoreActions.bindProvider);
    container.register(ModelParser);
    container.register(BaseController);
}

export function registerDefaultMiddlewars(container: IContainer) {
    container.register(symbols.ContentMiddleware, DefaultContentMiddleware);
    container.register(symbols.ContextMiddleware, DefaultContextMiddleware);
    container.register(symbols.JsonMiddleware, DefaultJsonMiddleware);
    container.register(symbols.LogMiddleware, DefaultLogMiddleware);
    container.register(symbols.SessionMiddleware, DefaultSessionMiddleware);
    container.register(symbols.BodyParserMiddleware, DefaultBodyParserMiddleware);
    container.register(symbols.ViewsMiddleware, DefaultViewsMiddleware);
    container.register(symbols.CorsMiddleware, DefaultCorsMiddleware);
    container.register(Router);
}
