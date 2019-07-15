
import { IocExt, ContainerToken, IContainer } from '@tsdi/core';
import { Controller, Authorization, Middleware, MvcModule } from './decorators';
import { Inject, DecoratorScopes, RuntimeDecoratorRegisterer, DesignDecoratorRegisterer, BindProviderAction, BindMethodProviderAction, IocSetCacheAction, Type, LoadType, DecoratorProvider, InjectReference, ProviderTypes } from '@tsdi/ioc';
import { MvcContext, MvcOptions, MvcContextToken } from './MvcContext';
import { ControllerRegisterAction, MiddlewareRegisterAction } from './registers';
import * as middlewares from './middlewares';
import * as routers from './router';
import * as services from './services';
import * as aop from './aop';
import { DefaultConfigureToken, DIModuleInjectorScope, BootApplication, checkBootArgs, BootContext, Startup } from '@tsdi/boot';
import { IConfiguration } from './IConfiguration';
import { MvcServer } from './MvcServer';
import { ConfigureRegister, Handle } from '@tsdi/boot';
import { DebugLogAspect, LogConfigureToken, LogModule, ConfigureLoggerManger } from '@tsdi/logs';
import { Singleton, isArray, isClass, isFunction, lang } from '@tsdi/ioc';
import { DefaultMvcMiddlewares, DefaultMvcMiddlewaresToken } from './DefaultMvcMiddlewares';
import { MvcModuleMetadata } from './metadata';
import { MvcMiddlewares, MiddlewareRegister } from './middlewares';
import * as http from 'http';
import * as https from 'https';
import { RegFor } from '@tsdi/boot';
import { AopModule } from '@tsdi/aop';
import { ServerBootstrapModule } from '@tsdi/platform-server-boot';
import { ServerLogsModule } from '@tsdi/platform-server-logs';
import * as Koa from 'koa';
import { MvcApp } from './MvcApp';
import { ExtendBaseTypeMap } from './router';
import { BeforeMidddlewareStartupService, AfterMidddlewareStartupService } from './services';
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
        this.container.bindProvider(MvcContextToken, ctx);
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

        let orgConfig = config;
        config = ctx.configuration = Object.assign({}, config, ctx.annoation);

        ctx.getKoa().keys = config.keys;

        if (config.debug) {
            this.container.register(DebugLogAspect);
            // disable custom log.
            config.logConfig = null;
        }

        let logConfig = config.logConfig;
        if (logConfig) {
            this.container.bindProvider(LogConfigureToken, logConfig);
            ctx.logManager = this.container.resolve(ConfigureLoggerManger);
        }

        if (!this.container.has(DefaultMvcMiddlewaresToken)) {
            this.container.bindProvider(DefaultMvcMiddlewaresToken, DefaultMvcMiddlewares)
        }

        let middlewares = this.container.get(MvcMiddlewares);
        let metadata = ctx.annoation as MvcModuleMetadata;
        let mvcMiddles = metadata.middlewares || this.container.get(DefaultMvcMiddlewaresToken);
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

        this.container.invoke(MiddlewareRegister, tag => tag.setup);

        if (!ctx.httpServer) {
            if (config.httpsOptions) {
                ctx.httpServer = https.createServer(config.httpsOptions, ctx.getKoa().callback());
            } else {
                ctx.httpServer = http.createServer(ctx.getKoa().callback());
            }
        }

        if (config.controllers) {
            await this.container.load({
                basePath: ctx.getRootPath(),
                files: config.controllers
            });
        }

        await Promise.all(this.container.getServices(BeforeMidddlewareStartupService)
            .map(s => s.startup(ctx, middlewares)));

        this.container.get(MvcMiddlewares)
            .setup(ctx);

        await Promise.all(this.container.getServices(AfterMidddlewareStartupService)
            .map(s => s.startup(ctx, middlewares)));

        if (config.subSites && config.subSites.length) {
            await Promise.all(config.subSites.map(async site => {
                let koa: Koa;
                if (isClass(site.app)) {
                    let subCtx = await MvcApplication.run(
                        {
                            autorun: false,
                            module: site.app,
                            regFor: RegFor.child,
                            configures: [lang.omit(orgConfig, 'subsites')]
                        });
                    koa = subCtx.getKoa() as any;
                } else if (isFunction(site.app)) {
                    koa = await site.app(orgConfig);
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



@IocExt('setup')
class MvcCoreModule {

    constructor() {

    }

    setup(@Inject(ContainerToken) container: IContainer) {
        container.register(MvcContext)
            .register(MvcServer)
            .register(MvcConfigureRegister);

        container.register(ExtendBaseTypeMap);
        container.use(aop, services, middlewares, routers);

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
            .register(container, MiddlewareRegisterAction);

        let dreger = container.get(DesignDecoratorRegisterer);
        dreger.register(Controller, DecoratorScopes.Class, BindProviderAction, ControllerRegisterAction)
            .register(Authorization, DecoratorScopes.Class, BindProviderAction)
            .register(Middleware, DecoratorScopes.Class, BindProviderAction, MiddlewareRegisterAction)
            .register(MvcModule, DecoratorScopes.Class, BindProviderAction);

        let runtimeRgr = container.get(RuntimeDecoratorRegisterer);
        runtimeRgr.register(Authorization, DecoratorScopes.Method, BindMethodProviderAction)
            .register(MvcModule, DecoratorScopes.Class, IocSetCacheAction);


        container.get(DesignDecoratorRegisterer).getRegisterer(DecoratorScopes.Injector)
            .register(MvcModule, DIModuleInjectorScope);


        container.get(DecoratorProvider)
            .bindProviders(MvcModule,
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

