import {
    IocExt, Inject, DecoratorScopes,
    BindProviderAction, BindMethodProviderAction, IocSetCacheAction, Type,
    DecoratorProvider, InjectReference, ProviderTypes, Singleton, isArray,
    isClass, isFunction, lang, ActionInjector, DesignRegisterer, RuntimeRegisterer, IProviders
} from '@tsdi/ioc';
import { LoadType, ContainerToken, IContainer, ModuleProvider } from '@tsdi/core';
import { AopModule } from '@tsdi/aop';
import { DebugLogAspect, LogConfigureToken, LogModule } from '@tsdi/logs';
import {
    DefaultConfigureToken, BootApplication, checkBootArgs, BootContext, ModuleInjector,
    Startup, ConfigureRegister, Handle, registerModule, ModuleProvidersBuilderToken, ModuleProviders
} from '@tsdi/boot';
import { ServerBootstrapModule } from '@tsdi/platform-server-boot';
import { ServerLogsModule } from '@tsdi/platform-server-logs';
import { Controller, Authorization, Middleware, MvcModule } from './decorators';
import { MvcContext, MvcOptions, MvcContextToken } from './MvcContext';
import { ControllerRegisterAction } from './registers/ControllerRegisterAction';
import { MiddlewareRegisterAction } from './registers/MiddlewareRegisterAction';
import { IConfiguration } from './IConfiguration';
import { MvcServer } from './MvcServer';
import { DefaultMvcMiddlewares, DefaultMvcMiddlewaresToken } from './DefaultMvcMiddlewares';
import * as http from 'http';
import * as https from 'https';
import * as Koa from 'koa';
import { MvcApp } from './MvcApp';
import { RouteChecker } from './services/RouteChecker';
import { AuthorizationAspect } from './aop/AuthorizationAspect';
import { CompositeMiddleware } from './middlewares/MvcMiddleware';
import { ControllerRoute } from './router/ControllerRoute';
import { CorsMiddleware } from './router/CorsMiddleware';
import { Router } from './router/Router';
import { MvcMiddlewares } from './middlewares/MvcMiddlewares';
import { MiddlewareRegister } from './middlewares/MiddlewareRegister';
import { ExtendBaseTypeMap } from './router/ModelParser';
import { RouterMiddleware } from './router/RouterMiddleware';
import { BeforeMidddlewareStartupService } from './services/BeforeMidddlewareStartupService';
import { AfterMidddlewareStartupService } from './services/AfterMidddlewareStartupService';
import { MvcModuleMetadata } from './metadata';
const mount = require('koa-mount');


/**
 * Default Application of type mvc.
 *
 * @export
 * @class Application
 * @implements {IApplication}
 */
export class MvcApplication extends BootApplication<MvcContext> {

    getBootDeps() {
        let deps = super.getBootDeps();
        return [AopModule, LogModule, ServerBootstrapModule, ServerLogsModule, MvcCoreModule, ...deps];
    }

    /**
     * run mvc application.
     *
     * @static
     * @template T
     * @param {(T | Type | MvcOptions)} [target]
     * @param {(LoadType[] | LoadType | string)} [deps]
     * @param {...string[]} args
     * @returns {Promise<T>}
     * @memberof MvcApplication
     */
    static async run<T extends MvcContext>(target?: T | Type | MvcOptions, deps?: LoadType[] | LoadType | string, ...args: string[]): Promise<T> {
        let mdargs = checkBootArgs(deps, ...args);
        target = target || MvcApp;
        return await new MvcApplication(target, mdargs.deps).run(...mdargs.args) as T;
    }

    onContextInit(ctx: MvcContext) {
        super.onContextInit(ctx);
        this.getContainer().bindProvider(MvcContextToken, ctx);
    }
}

/**
 * configure register.
 *
 * @export
 * @class MvcConfigureRegister
 * @extends {ConfigureRegister}
 */
@Singleton
export class MvcConfigureRegister extends ConfigureRegister<MvcContext> {

    async register(config: IConfiguration, ctx: MvcContext): Promise<void> {

        ctx.getKoa().keys = config.keys;
        let injector = ctx.injector;

        if (config.debug) {
            injector.register(DebugLogAspect);
            // disable custom log.
            config.logConfig = null;
        }

        let logConfig = config.logConfig;
        if (logConfig && !injector.has(LogConfigureToken)) {
            injector.bindProvider(LogConfigureToken, logConfig);
        }

        if (!injector.has(DefaultMvcMiddlewaresToken)) {
            injector.bindProvider(DefaultMvcMiddlewaresToken, DefaultMvcMiddlewares)
        }

        // setup global middlewares
        let middlewares = injector.get(MvcMiddlewares);
        let metadata = ctx.getAnnoation();
        let mvcMiddles = metadata.middlewares || injector.get(DefaultMvcMiddlewaresToken);
        if (isArray(mvcMiddles)) {
            mvcMiddles.forEach(middle => {
                if (isClass(middle)) {
                    middlewares.use(middle);
                } else if (isFunction(middle)) {
                    let mid = middle(config, ctx);
                    if (isFunction(mid)) {
                        middlewares.use(mid);
                    }
                } else if (middle instanceof Handle) {
                    middlewares.use(middle)
                }
            });
        }

        // load extends midllewares.
        if (config.loadMiddlewares) {
            await injector.load({
                basePath: ctx.getRootPath(),
                files: config.loadMiddlewares
            });
        }

        injector.invoke(MiddlewareRegister, tag => tag.setup);

        if (!ctx.httpServer) {
            if (config.httpsOptions) {
                ctx.httpServer = https.createServer(config.httpsOptions, ctx.getKoa().callback());
            } else {
                ctx.httpServer = http.createServer(ctx.getKoa().callback());
            }
        }

        if (config.loadControllers) {
            await injector.load({
                basePath: ctx.getRootPath(),
                files: config.loadControllers
            });
        }

        await Promise.all(injector.getServices(BeforeMidddlewareStartupService)
            .map(s => s.startup(ctx, middlewares)));

        injector.get(MvcMiddlewares)
            .setup(ctx);

        await Promise.all(injector.getServices(AfterMidddlewareStartupService)
            .map(s => s.startup(ctx, middlewares)));

        if (config.subSites && config.subSites.length) {
            await Promise.all(config.subSites.map(async site => {
                let koa: Koa;
                if (isClass(site.app)) {
                    let subCtx = await MvcApplication.run(
                        {
                            autorun: false,
                            module: site.app,
                            configures: [lang.omit(config, 'subsites')]
                        });
                    koa = subCtx.getKoa() as any;
                } else if (isFunction(site.app)) {
                    koa = await site.app(config);
                } else {
                    koa = site.app;
                }
                if (koa) {
                    ctx.getKoa().use(mount(site.routePrefix, koa));
                }
            }));
        }
    }
}



@IocExt()
class MvcCoreModule {

    constructor() {

    }

    setup(@Inject(ContainerToken) container: IContainer) {
        container.registerType(MvcContext)
            .registerType(MvcServer);
        // .registerType(MvcConfigureRegister);

        container.inject(ExtendBaseTypeMap, AuthorizationAspect, RouteChecker,
            CompositeMiddleware, MvcMiddlewares, MiddlewareRegister, CorsMiddleware,
            Router, ControllerRoute, RouterMiddleware);


        container.bindProvider(DefaultConfigureToken, <IConfiguration>{
            hostname: '',
            port: 3000,
            routePrefix: '',
            setting: {},
            loadMiddlewares: ['./middlewares/**/*{.js,.ts}', '!./**/*.d.ts'],
            loadControllers: ['./controllers/**/*{.js,.ts}', '!./**/*.d.ts'],
            aop: ['./aop/**/*{.js,.ts}', '!./**/*.d.ts'],
            views: './views',
            corsOptions: {
                allowMethods: 'GET,PUT,POST,DELETE,OPTIONS',
                maxAge: 60 * 60 * 1000
            },
            viewsOptions: {
                extension: 'ejs',
                map: { html: 'nunjucks' }
            },
            models: ['./models/**/*{.js,.ts}', '!./**/*.d.ts'],
            debug: false,
            keys: ['typemvc'],
            contents: ['./public']
        });

        let actInjector = container.getInstance(ActionInjector);

        actInjector.register(ControllerRegisterAction)
            .register(MiddlewareRegisterAction);

        let dreger = actInjector.getInstance(DesignRegisterer);
        dreger.register(Controller, DecoratorScopes.Class, BindProviderAction, ControllerRegisterAction)
            .register(Authorization, DecoratorScopes.Class, BindProviderAction)
            .register(Middleware, DecoratorScopes.Class, BindProviderAction, MiddlewareRegisterAction);

        registerModule(MvcModule, dreger);
        let runtimeRgr = actInjector.getInstance(RuntimeRegisterer);
        runtimeRgr.register(Authorization, DecoratorScopes.Method, BindMethodProviderAction)
            .register(MvcModule, DecoratorScopes.Class, IocSetCacheAction);


        actInjector.getInstance(DecoratorProvider)
            .bindProviders(MvcModule,
                MvcConfigureRegister,
                {
                    provide: ModuleProvidersBuilderToken,
                    useValue: {
                        build(providers: ModuleProviders, annoation: MvcModuleMetadata) {
                            if (annoation.controllers && annoation.controllers.length) {
                                providers.injectModule(...annoation.controllers);
                            }
                        }
                    }
                },
                {
                    provide: BootContext,
                    deps: [ContainerToken],
                    useFactory: (container: IContainer, ...providers: ProviderTypes[]) => {
                        let ref = new InjectReference(BootContext, MvcModule.toString());
                        if (container.has(ref)) {
                            return container.get(ref, ...providers);
                        } else {
                            return container.get(MvcContext, ...providers);
                        }
                    }
                },
                {
                    provide: Startup,
                    deps: [ContainerToken],
                    useFactory: (container: IContainer, ...providers: ProviderTypes[]) => {
                        let ref = new InjectReference(Startup, MvcModule.toString());
                        if (container.has(ref)) {
                            return container.get(ref, ...providers);
                        }
                        return null;
                    }
                });
    }
}

