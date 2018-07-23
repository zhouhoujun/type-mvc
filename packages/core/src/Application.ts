import { NonePointcut } from '@ts-ioc/aop';
import * as Koa from 'koa';
import { Singleton, IContainer, Inject, InjectToken, ContainerToken, isToken, Token, isFunction } from '@ts-ioc/core';
import * as http from 'http';
import * as https from 'https';
import { IConfiguration, ConfigurationToken } from './IConfiguration';
import { ILogger, ILoggerManager, IConfigureLoggerManager, ConfigureLoggerManagerToken } from '@ts-ioc/logs';
import { IServerMiddleware, ServerMiddleware } from './servers';
import { IMiddleware, ViewsMiddlewareToken, CorsMiddlewareToken, ContextMiddlewareToken, ContentMiddlewareToken, SessionMiddlewareToken, LogMiddlewareToken, JsonMiddlewareToken, BodyParserMiddlewareToken } from './middlewares';
import { IApplication } from './IApplication';

/**
 * Application of type mvc.
 *
 * @export
 * @class Application
 * @extends {Koa}
 */
@NonePointcut
@Singleton
export class Application implements IApplication {

    private httpServer: http.Server | https.Server;
    private koa: Koa;
    private _loggerMgr: ILoggerManager;

    @Inject(ContainerToken)
    container: IContainer;

    @Inject(ConfigurationToken)
    configuration: IConfiguration;

    constructor() {

    }

    getServer(): Koa {
        if (!this.koa) {
            this.koa = new Koa();
        }
        return this.koa;
    }

    getLoggerManger(): ILoggerManager {
        if (!this._loggerMgr) {
            let cfg = this.configuration;
            this._loggerMgr = this.container.resolve<IConfigureLoggerManager>(ConfigureLoggerManagerToken, { config: cfg.logConfig })
        }
        return this._loggerMgr;
    }


    getLogger(name?: string): ILogger {
        return this.getLoggerManger().getLogger(name);
    }

    getHttpServer() {
        if (!this.httpServer) {
            let cfg = this.configuration;
            if (cfg.httpsOptions) {
                this.httpServer = https.createServer(cfg.httpsOptions, this.getServer().callback);
            } else {
                this.httpServer = http.createServer(this.getServer().callback());
            }
        }
        return this.httpServer;
    }

    use(middleware: Koa.Middleware) {
        this.getServer().use(middleware);
    }

    middlewareOrder(): InjectToken<IMiddleware>[] {
        return [
            BodyParserMiddlewareToken,
            JsonMiddlewareToken,
            LogMiddlewareToken,
            SessionMiddlewareToken,
            ContentMiddlewareToken,
            ContextMiddlewareToken,
            CorsMiddlewareToken,
            ViewsMiddlewareToken
        ]
    }

    setup(beforeSMdls: (ServerMiddleware | Token<IServerMiddleware>)[], afterSMdls: (ServerMiddleware | Token<IServerMiddleware>)[]) {
        this.setupServerMiddwares(beforeSMdls);
        let cfg = this.configuration;
        let excludes = this.getExcludeMiddwares(cfg);
        let filter = (excludes: any[]) => {
            return (m) => {
                if (excludes.length) {
                    return excludes.indexOf(m) < 0;
                }
                return true;
            }
        };
        this.setupMiddlewares(cfg.beforeMiddlewares, filter(excludes));
        this.setupMiddlewares(this.middlewareOrder(), filter(excludes));
        this.setupMiddlewares(cfg.useMiddlewares as Token<any>[], filter(excludes.concat(cfg.afterMiddlewares)));
        this.setupRoutes(cfg);
        this.setupMiddlewares(cfg.afterMiddlewares, filter(excludes));
        this.setupServerMiddwares(afterSMdls);
    }


    setupRoutes(config: IConfiguration) {
        let router: IRouter = this.container.get(config.routerMiddlewate || RouterMiddlewareToken);
        router.register(...config.useControllers);
        router.setup();
    }

    setupMiddlewares(middlewares: Token<IMiddleware>[], filter?: (token: Token<IMiddleware>) => boolean) {
        if (!middlewares || middlewares.length < 1) {
            return;
        }
        middlewares.forEach(m => {
            if (!m) {
                return;
            }
            if (filter && !filter(m)) {
                return;
            }
            if (isToken(m)) {
                let middleware = this.container.get(m);
                if (isFunction(middleware.setup)) {
                    middleware.setup();
                }
            } else if (isFunction(m)) {
                this.use(m);
            }

        });
    }

    protected registerRouter() {
        this.container.register(Router);
    }

    protected getExcludeMiddwares(cfg: IConfiguration): Token<any>[] {
        return cfg.excludeMiddlewares || [];
    }

    protected setupServerMiddwares(middlewares: (ServerMiddleware | Token<IServerMiddleware>)[]) {
        if (!middlewares || middlewares.length < 1) {
            return;
        }
        middlewares.forEach(m => {
            if (!m) {
                return;
            }

            if (isToken(m)) {
                let middleware = this.container.get(m as Token<any>) as IServerMiddleware;
                if (isFunction(middleware.setup)) {
                    middleware.setup();
                }

            } else if (isFunction(m)) {
                m(this, this.container);
            }

        })
    }

}
