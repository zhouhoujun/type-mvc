import {
    IocExt, Inject, TypeProviderAction, MthProviderAction, IocSetCacheAction, Type,
    DecoratorProvider, InjectReference, ProviderTypes, Singleton, isArray,
    isClass, isFunction, lang, ActionInjector, DesignRegisterer, RuntimeRegisterer, isDefined
} from '@tsdi/ioc';
import { LoadType, ContainerToken, IContainer } from '@tsdi/core';
import { AopModule } from '@tsdi/aop';
import { DebugLogAspect, LogConfigureToken, LogModule, ILogger } from '@tsdi/logs';
import {
    DefaultConfigureToken, BootApplication, checkBootArgs, BootContext, Startup, ConfigureRegister,
    Handle, registerModule, ModuleProvidersBuilderToken, ModuleProviders, ORMCoreModule, StartupService, CTX_APP_STARTUPS
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
import { RouterMiddleware } from './router/RouterMiddleware';
import { BeforeMidddlewareStartupService } from './services/BeforeMidddlewareStartupService';
import { AfterMidddlewareStartupService } from './services/AfterMidddlewareStartupService';
import { MvcModuleMetadata } from './metadata';
import { ServerFactoryToken } from './ServerFactory';
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
        return [AopModule, LogModule, ServerBootstrapModule, ORMCoreModule, ServerLogsModule, MvcCoreModule, ...deps];
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
        let tokens = ctx.getStarupTokens() || [];
        tokens.unshift(MvcStartupService);
        ctx.setValue(CTX_APP_STARTUPS, tokens);
        this.getContainer().setSingleton(MvcContextToken, ctx);
    }
}

/**
 * configure register.
 *
 * @export
 * @class MvcConfigureRegister
 * @extends {ConfigureRegister}
 */
@Singleton()
export class MvcStartupService extends StartupService<MvcContext> {
    private logger: ILogger;
    private ctx: MvcContext;
    private subs: MvcContext[];

    async configureService(ctx: MvcContext): Promise<void> {
        if (isDefined(process)) {
            process.once('beforeExit', () => {
                ctx.destroy();
            });
        }
        this.ctx = ctx;
        this.logger = ctx.getLogManager().getLogger();
        this.logger.info('startup mvc controllers and middlewares');
        const config = ctx.getConfiguration();
        this.subs = [];

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

        if (!injector.hasRegister(ServerFactoryToken)) {
            injector.setValue(ServerFactoryToken, (ctx, config) => {
                return config.httpsOptions ?
                    (config.httpsOptions.secureProtocol ?
                        https.createServer(config.httpsOptions, ctx.getKoa().callback())
                        : http.createServer(config.httpsOptions, ctx.getKoa().callback()))
                    : http.createServer(ctx.getKoa().callback());
            });
        }

        if (!ctx.httpServer) {
            ctx.httpServer = injector.get(ServerFactoryToken)(ctx, config);
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
                let subCtx: MvcContext;
                if (isClass(site.app)) {
                    let subCtx = await MvcApplication.run(
                        {
                            autorun: false,
                            module: site.app,
                            configures: [lang.omit(config, 'subsites')]
                        });
                    this.subs.push(subCtx);
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

    protected destroying() {
        this.logger.info('remove controllers and middlewares.');
        let koa = this.ctx.getKoa();
        koa.removeAllListeners();
        koa.middleware.length = 0;
        if (this.subs.length) {
            this.subs.forEach(s => s?.destroy());
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

        container.inject(AuthorizationAspect, RouteChecker,
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
            repositories: ['./repositories/**/*.(ts|js)', '!./**/*.d.ts'],
            debug: false,
            keys: ['typemvc'],
            contents: ['./public']
        });

        let actInjector = container.getInstance(ActionInjector);

        actInjector.register(ControllerRegisterAction)
            .register(MiddlewareRegisterAction);

        let dreger = actInjector.getInstance(DesignRegisterer);
        dreger.register(Controller, 'Class', TypeProviderAction, ControllerRegisterAction)
            .register(Authorization, 'Class', TypeProviderAction)
            .register(Middleware, 'Class', TypeProviderAction, MiddlewareRegisterAction);

        registerModule(MvcModule, dreger);
        let runtimeRgr = actInjector.getInstance(RuntimeRegisterer);
        runtimeRgr.register(Authorization, 'Method', MthProviderAction)
            .register(MvcModule, 'Class', IocSetCacheAction);


        actInjector.getInstance(DecoratorProvider)
            .bindProviders(MvcModule,
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

