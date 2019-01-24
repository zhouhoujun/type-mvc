import { IContainer, Inject, ContainerToken, lang, Type, isClass, hasOwnClassMetadata, Injectable } from '@ts-ioc/core';
import { IConfiguration } from './IConfiguration';
import { ILogger, ILoggerManager, IConfigureLoggerManager, ConfigureLoggerManagerToken } from '@ts-ioc/logs';
import { IApplication, ApplicationToken } from './IApplication';
import { IMvcServer, IMvcHostBuilder } from './IMvcServer';
import { MiddlewareChainToken, IMiddlewareChain, CustomMiddleware } from './middlewares';
import { Boot, RunOptions, IConfigureManager, RunnableOptions, RunnableOptionsToken, IRunnableBuilder } from '@ts-ioc/bootstrap';
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

    constructor(@Inject(RunnableOptionsToken) options: RunnableOptions<IMvcServer>) {
        super(options);
        this.controllers = [];
        this.middlewares = [];
    }

    async onInit(options: RunOptions<IMvcServer>) {
        this.configMgr = options.configManager;
        let gcfg = await this.configMgr.getConfig();
        this.config = lang.assign(gcfg, this.config);

        this.getServer().init(this.config);
        this.router = this.container.resolve(Router);
        this.router.setRoot(this.config.routePrefix);

        this.builder = options.bootBuilder as IMvcHostBuilder;

        this.builder.getPools().iterator(c => {
            c.forEach((tk, fac) => {
                if (isClass(tk)) {
                    if (hasOwnClassMetadata(Controller, tk)) {
                        this.controllers.push(tk);
                    } else if (hasOwnClassMetadata(Middleware, tk)) {
                        this.middlewares.push(tk);
                    }
                }
            })
        });

        this.router.register(...this.getControllers());

        this.getMiddleChain()
            .use(...[...this.getMiddlewares(), ...this.builder.middlewares])
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
