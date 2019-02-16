import { IContainer, Inject, ContainerToken, lang, Type, isClass, hasOwnClassMetadata, Injectable, ResoveWay } from '@ts-ioc/core';
import { IConfiguration, ConfigurationToken } from './IConfiguration';
import { ILogger, ILoggerManager, IConfigureLoggerManager, ConfigureLoggerManagerToken } from '@ts-ioc/logs';
import { IApplication, ApplicationToken } from './IApplication';
import { IMvcServer, IMvcHostBuilder } from './IMvcServer';
import { MiddlewareChainToken, IMiddlewareChain, CustomMiddleware, MiddlewareType } from './middlewares';
import { Boot, RunOptions, IConfigureManager, RunnableOptions, RunnableOptionsToken } from '@ts-ioc/bootstrap';
import { Controller, Middleware } from './decorators';
import { IRouter, Router } from './router';

/**
 * Default Application of type mvc.
 *
 * @export
 * @class Application
 * @implements {IApplication}
 */
@Injectable(ApplicationToken)
export class Application extends Boot<IMvcServer> implements IApplication {
    name?: string;

    protected config: IConfiguration;
    private _loggerMgr: ILoggerManager;
    protected router: IRouter;
    protected builder: IMvcHostBuilder;

    @Inject(ContainerToken)
    container: IContainer;

    getConfig(): IConfiguration {
        return this.config as IConfiguration;
    }

    protected controllers: Type<any>[];
    protected middlewares: Type<any>[];

    @Inject(MiddlewareChainToken)
    middlewareChain: IMiddlewareChain;

    private configMgr: IConfigureManager<IConfiguration>;

    constructor() {
        super();
        this.controllers = [];
        this.middlewares = [];
    }

    async onInit(options: RunnableOptions<IMvcServer>, bootOptions: RunOptions<IMvcServer>) {
        await super.onInit(options, bootOptions);
        this.configMgr = bootOptions.configManager;
        let gcfg = await this.configMgr.getConfig();
        this.config = lang.assign(gcfg, this.config);
        this.container.bindProvider(ConfigurationToken, this.config);
        this.getServer().init(this.config);
        this.router = this.container.resolve(Router);
        this.router.setRoot(this.config.routePrefix);

        this.builder = bootOptions.bootBuilder as IMvcHostBuilder;

        this.builder.getPools().iterator(c => {
            c.forEach((tk, fac) => {
                if (isClass(tk)) {
                    if (hasOwnClassMetadata(Controller, tk)) {
                        this.controllers.push(tk);
                        this.container.bindProvider(tk, fac);
                    } else if (hasOwnClassMetadata(Middleware, tk)) {
                        this.middlewares.push(tk);
                        this.container.bindProvider(tk, fac);
                    }
                }
            })
        });

        this.router.register(...this.getControllers());

        let midds: MiddlewareType[] = this.builder.middlewares || [];
        midds = midds.concat(this.getMiddlewares() || []);
        this.getMiddleChain()
            .use(...midds)
            .setup(this);

    }

    getConfigureManager(): IConfigureManager<IConfiguration> {
        return this.configMgr;
    }

    getHostBuilder(): IMvcHostBuilder {
        return this.builder;
    }

    getRouter(): IRouter {
        return this.router;
    }

    getControllers(): Type<any>[] {
        return this.controllers;
    }

    getMiddlewares(): Type<any>[] {
        return this.middlewares;
    }

    getMiddleChain(): IMiddlewareChain {
        return this.container.resolve(MiddlewareChainToken);
    }

    getServer(): IMvcServer {
        return this.options.instance;
    }

    getLoggerManger(): ILoggerManager {
        if (!this._loggerMgr) {
            let cfg = this.getConfig();
            this._loggerMgr = this.container.resolve<IConfigureLoggerManager>(ConfigureLoggerManagerToken, { config: cfg.logConfig })
        }
        return this._loggerMgr;
    }


    getLogger(name?: string): ILogger {
        return this.getLoggerManger().getLogger(name);
    }

    use(middleware: CustomMiddleware) {
        this.getServer().use(middleware);
    }

    useFac(middlewareFactory: (core?: any, httpServer?: any) => CustomMiddleware) {
        this.getServer().useFac(middlewareFactory);
    }

    async start() {
        this.getServer().start();
    }

    async stop() {
        this.getServer().stop();
    }

}
