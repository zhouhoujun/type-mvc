import { IContainer, symbols as iocSymbols, CoreActions } from 'tsioc';

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
import { symbols } from '../util';
export function registerDecorators(container: IContainer) {
    let lifeScope = container.getLifeScope();
    lifeScope.registerDecorator(Controller, CoreActions.bindProvider);
    lifeScope.registerDecorator(Authorization, CoreActions.bindProvider);
    lifeScope.registerDecorator(Middleware, CoreActions.bindProvider);
}

