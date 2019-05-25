import { IocExt, ContainerToken, IContainer } from '@tsdi/core';
import { Controller, Authorization, Middleware } from './decorators';
import { Inject, DecoratorScopes, RuntimeDecoratorRegisterer, DesignDecoratorRegisterer, BindProviderAction, BindMethodProviderAction } from '@tsdi/ioc';
import { MvcContext } from './MvcContext';
import { ControllerRegisterAction, MiddlewareRegisterAction } from './registers';
import { MiddlewareRegisterer } from './middlewares';
import { Router } from './router';
import { RouteChecker } from './services';


@IocExt('setup')
export class MvcCoreModule {

    constructor() {

    }

    setup(@Inject(ContainerToken) container: IContainer) {
        container.register(MvcContext)
            .register(Router)
            .register(MiddlewareRegisterer)
            .register(RouteChecker);

        container.getActionRegisterer()
            .register(container, ControllerRegisterAction)
            .register(container, MiddlewareRegisterAction);

        let dreger = container.get(DesignDecoratorRegisterer);
        dreger.register(Controller, DecoratorScopes.Class, BindProviderAction, ControllerRegisterAction)
            .register(Authorization, DecoratorScopes.Class, BindProviderAction)
            .register(Middleware, DecoratorScopes.Class, BindProviderAction, MiddlewareRegisterAction);

        let runtimeRgr = container.get(RuntimeDecoratorRegisterer);
        runtimeRgr.register(Authorization, DecoratorScopes.Method, BindMethodProviderAction);
    }
}
