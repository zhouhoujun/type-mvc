import { Singleton, Type, isString, isFunction, Inject } from '@tsdi/ioc';
import { IMiddleware } from './IMiddleware';
import { MiddlewareMetadata } from '../metadata';
import { IContainer, ContainerToken } from '@tsdi/core';
import { CompositeMiddleware } from './MvcMiddleware';
import { MvcMiddlewares } from './MvcMiddlewares';

@Singleton
export class MiddlewareRegister extends Map<Type<IMiddleware>, MiddlewareMetadata> {

    setup(@Inject(ContainerToken) container: IContainer) {
        this.forEach((meta, middle) => {
            let middlewares: CompositeMiddleware = container.resolve(MvcMiddlewares);
            if (meta.regIn) {
                let comp = meta.regIn;
                if (!container.has(comp)) {
                    container.register(comp);
                }
                middlewares = container.get(comp);
            }
            if (meta.before) {
                middlewares.useBefore(middle, isString(meta.before) ?
                    middlewares.find(item => isFunction(item) && item.name === meta.before)
                    : meta.before);
            } else if (meta.after) {
                middlewares.useAfter(middle, isString(meta.after) ?
                    middlewares.find(item => isFunction(item) && item.name === meta.after)
                    : meta.after);
            } else {
                middlewares.use(middle);
            }

        });
    }
}
