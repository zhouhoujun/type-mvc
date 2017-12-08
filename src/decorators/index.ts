import { IContainer, symbols as iocSymbols, CoreActions, ICoreActionBuilder } from 'tsioc';

export * from './Controller';
export * from './Delete';
export * from './Get';
export * from './Head';
export * from './Options';
export * from './Patch';
export * from './Post';
export * from './Put';
export * from './Route';
export * from './Cors';
// export * from './Router';
export * from './Authorization';
export * from './Model';
export * from './Field';
export * from './Middleware';
export * from './metadata';

import { Controller, Authorization, Middleware } from './';
import { symbols } from '../index';
export function registerDecorators(container: IContainer) {
    let builder = container.get<ICoreActionBuilder>(iocSymbols.ICoreActionBuilder);
    container.registerDecorator(Controller,
        builder.build(Controller.toString(), container.getDecoratorType(Controller), CoreActions.bindProvider));

    container.registerDecorator(Authorization,
        builder.build(Authorization.toString(), container.getDecoratorType(Authorization), CoreActions.bindProvider));

    container.registerDecorator(Middleware,
        builder.build(Middleware.toString(), container.getDecoratorType(Middleware), CoreActions.bindProvider));
}

