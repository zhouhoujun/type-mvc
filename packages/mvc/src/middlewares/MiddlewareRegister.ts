import { Singleton, Type, Inject, INJECTOR } from '@tsdi/ioc';
import { ICoreInjector } from '@tsdi/core';
import { IMiddleware } from './IMiddleware';
import { MiddlewareMetadata } from '../metadata';
import { CompositeMiddleware } from './MvcMiddleware';
import { MvcMiddlewares } from './MvcMiddlewares';

/**
 * middleware register.
 *
 * @export
 * @class MiddlewareRegister
 */
@Singleton()
export class MiddlewareRegister {
    static ρNPT = true;
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
     * @param {ICoreInjector} injector
     * @memberof MiddlewareRegister
     */
    setup(@Inject(INJECTOR) injector: ICoreInjector) {
        this.map.forEach((meta, middle) => {
            let middlewares: CompositeMiddleware = injector.getInstance(MvcMiddlewares);
            if (meta.regIn) {
                let comp = meta.regIn;
                if (!injector.has(comp)) {
                    injector.register(comp);
                }
                middlewares = injector.get(comp);
            }
            if (meta.before) {
                middlewares.useBefore(middle, meta.before);
            } else if (meta.after) {
                console.log('use after', middlewares, meta.after);
                middlewares.useAfter(middle, meta.after);
                console.log(middlewares);
            } else {
                middlewares.use(middle);
            }

        });
    }
}
