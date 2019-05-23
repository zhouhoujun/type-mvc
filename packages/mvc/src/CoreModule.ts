import { IocExt, ContainerToken, IContainer } from '@tsdi/core';
import { Controller, Authorization, Middleware } from './decorators';
import { Inject, DecoratorScopes, RuntimeDecoratorRegisterer, DesignDecoratorRegisterer, BindProviderAction, BindMethodProviderAction } from '@tsdi/ioc';
import { MvcContext } from './MvcContext';


@IocExt('setup')
export class MvcCoreModule {

    constructor() {

    }

    setup(@Inject(ContainerToken) container: IContainer) {
        container.register(MvcContext);
        let dreger = container.get(DesignDecoratorRegisterer);
        dreger.register(Controller, DecoratorScopes.Class, BindProviderAction)
            .register(Authorization, DecoratorScopes.Class, BindProviderAction)
            .register(Middleware, DecoratorScopes.Class, BindProviderAction);

        let runtimeRgr = container.get(RuntimeDecoratorRegisterer);
        runtimeRgr.register(Authorization, DecoratorScopes.Method, BindMethodProviderAction);
    }
}
