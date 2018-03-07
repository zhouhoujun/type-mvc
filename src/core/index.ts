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
import { mvcSymbols } from '../util/index';
import { Router, ModelParser } from './router';
import { BaseController } from './BaseController';
import { Controller, Authorization, Middleware, Model } from './decorators';

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
    container.register(mvcSymbols.ContentMiddleware, DefaultContentMiddleware);
    container.register(mvcSymbols.ContextMiddleware, DefaultContextMiddleware);
    container.register(mvcSymbols.JsonMiddleware, DefaultJsonMiddleware);
    container.register(mvcSymbols.LogMiddleware, DefaultLogMiddleware);
    container.register(mvcSymbols.SessionMiddleware, DefaultSessionMiddleware);
    container.register(mvcSymbols.BodyParserMiddleware, DefaultBodyParserMiddleware);
    container.register(mvcSymbols.ViewsMiddleware, DefaultViewsMiddleware);
    container.register(mvcSymbols.CorsMiddleware, DefaultCorsMiddleware);
    container.register(Router);
}
