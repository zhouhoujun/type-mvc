import { Singleton, Type, isString, Inject } from '@tsdi/ioc';
import { IContainer, ContainerToken } from '@tsdi/core';
import { IMiddleware, isMiddlewareFunc } from './IMiddleware';
import { MiddlewareMetadata } from '../metadata';
import { CompositeMiddleware } from './MvcMiddleware';
import { MvcMiddlewares } from './MvcMiddlewares';

/**
 * middleware register.
 *
 * @export
 * @class MiddlewareRegister
 */
@Singleton
export class MiddlewareRegister {

    map: Map<Type<IMiddleware>, MiddlewareMetadata>;

    constructor() {
        this.map = new Map();
    }

    set(key: Type<IMiddleware>, val: MiddlewareMetadata) {
        this.map.set(key, val);
    }


    /**
     * setup middleware.
     *
     * @param {IContainer} container
     * @memberof MiddlewareRegister
     */
    setup(@Inject(ContainerToken) container: IContainer) {
        this.map.forEach((meta, middle) => {
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
                    middlewares.find(item => isMiddlewareFunc(item) && item.middleName === meta.before)
                    : meta.before);
            } else if (meta.after) {
                middlewares.useAfter(middle, isString(meta.after) ?
                    middlewares.find(item => isMiddlewareFunc(item) && item.middleName === meta.after)
                    : meta.after);
            } else {
                middlewares.use(middle);
            }

        });
    }
}
