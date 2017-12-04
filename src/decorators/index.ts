import { IContainer, ActionBuilder, ActionType } from 'tsioc';

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
export function registerDecorators(container: IContainer) {
    let builder = new ActionBuilder();
    container.registerDecorator(Controller,
        builder.build(Controller.toString(), container.getDecoratorType(Controller), ActionType.provider));

    container.registerDecorator(Authorization,
        builder.build(Authorization.toString(), container.getDecoratorType(Authorization), ActionType.provider));

    container.registerDecorator(Middleware,
        builder.build(Middleware.toString(), container.getDecoratorType(Middleware), ActionType.provider));
}

