import { IocExt, ContainerToken, IContainer, InjectorDecoratorRegisterer, ServiceDecoratorRegisterer } from '@tsdi/core';
import { Controller, Authorization, Middleware, MvcModule } from './decorators';
import { Inject, DecoratorScopes, RuntimeDecoratorRegisterer, DesignDecoratorRegisterer, BindProviderAction, BindMethodProviderAction, IocSetCacheAction } from '@tsdi/ioc';
import { MvcContext } from './MvcContext';
import { ControllerRegisterAction, MvcModuleDecoratorServiceAction, MiddlewareRegisterAction } from './registers';
import * as middlewares from './middlewares';
import * as routers from './router';
import * as services from './services';
import { DefaultConfigureToken, DIModuleInjectorScope } from '@tsdi/boot';
import { IConfiguration } from './IConfiguration';
import { MvcServer } from './MvcServer';
import { MvcConfigureRegister } from './MvcConfigureRegister';

@IocExt('setup')
export class MvcCoreModule {

    constructor() {

    }

    setup(@Inject(ContainerToken) container: IContainer) {
        container.register(MvcContext)
            .register(MvcServer)
            .register(MvcConfigureRegister);

        container.use(services, middlewares, routers);

        container.bindProvider(DefaultConfigureToken, <IConfiguration>{
            hostname: '',
            port: 3000,
            routePrefix: '',
            setting: {},
            middlewares: ['./middlewares/**/*{.js,.ts}', '!./**/*.d.ts'],
            controllers: ['./controllers/**/*{.js,.ts}', '!./**/*.d.ts'],
            aop: ['./aop/**/*{.js,.ts}', '!./**/*.d.ts'],
            views: './views',
            viewsOptions: {
                extension: 'ejs',
                map: { html: 'nunjucks' }
            },
            models: ['./models/**/*{.js,.ts}', '!./**/*.d.ts'],
            debug: false,
            keys: ['typemvc'],
            contents: ['./public']
        });

        container.getActionRegisterer()
            .register(container, ControllerRegisterAction)
            .register(container, MiddlewareRegisterAction)
            .register(container, MvcModuleDecoratorServiceAction);

        let dreger = container.get(DesignDecoratorRegisterer);
        dreger.register(Controller, DecoratorScopes.Class, BindProviderAction, ControllerRegisterAction)
            .register(Authorization, DecoratorScopes.Class, BindProviderAction)
            .register(Middleware, DecoratorScopes.Class, BindProviderAction, MiddlewareRegisterAction)
            .register(MvcModule, DecoratorScopes.Class, BindProviderAction);

        let runtimeRgr = container.get(RuntimeDecoratorRegisterer);
        runtimeRgr.register(Authorization, DecoratorScopes.Method, BindMethodProviderAction)
            .register(MvcModule, DecoratorScopes.Class, IocSetCacheAction);


        container.get(InjectorDecoratorRegisterer)
            .register(MvcModule, DIModuleInjectorScope);

        container.get(ServiceDecoratorRegisterer).register(MvcModule, MvcModuleDecoratorServiceAction);
    }
}
