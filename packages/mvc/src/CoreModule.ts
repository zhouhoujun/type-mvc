import { IocExt, ContainerToken, IContainer, InjectorDecoratorRegisterer, ServiceDecoratorRegisterer } from '@tsdi/core';
import { Controller, Authorization, Middleware, MvcModule } from './decorators';
import { Inject, DecoratorScopes, RuntimeDecoratorRegisterer, DesignDecoratorRegisterer, BindProviderAction, BindMethodProviderAction, IocSetCacheAction } from '@tsdi/ioc';
import { MvcContext } from './MvcContext';
import { ControllerRegisterAction, MvcModuleDecoratorServiceAction } from './registers';
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
            connections: {},
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
            session: {
                key: 'typemvc:sess', /** (string) cookie key (default is koa:sess) */
                /** (number || 'session') maxAge in ms (default is 1 days) */
                /** 'session' will result in a cookie that expires when session/browser is closed */
                /** Warning: If a session cookie is stolen, this cookie will never expire */
                maxAge: 86400000,
                overwrite: true, /** (boolean) can overwrite or not (default true) */
                httpOnly: true, /** (boolean) httpOnly or not (default true) */
                signed: true, /** (boolean) signed or not (default true) */
                rolling: false/** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. default is false **/
            },
            contents: ['./public']
        });

        container.getActionRegisterer()
            .register(container, ControllerRegisterAction)
            .register(container, MvcModuleDecoratorServiceAction);

        let dreger = container.get(DesignDecoratorRegisterer);
        dreger.register(Controller, DecoratorScopes.Class, BindProviderAction, ControllerRegisterAction)
            .register(Authorization, DecoratorScopes.Class, BindProviderAction)
            .register(Middleware, DecoratorScopes.Class, BindProviderAction)
            .register(MvcModule, DecoratorScopes.Class, BindProviderAction);

        let runtimeRgr = container.get(RuntimeDecoratorRegisterer);
        runtimeRgr.register(Authorization, DecoratorScopes.Method, BindMethodProviderAction)
            .register(MvcModule, DecoratorScopes.Class, IocSetCacheAction);


        container.get(InjectorDecoratorRegisterer)
            .register(MvcModule, DIModuleInjectorScope);

        container.get(ServiceDecoratorRegisterer).register(MvcModule, MvcModuleDecoratorServiceAction);
    }
}
