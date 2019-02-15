import { IConfiguration } from './IConfiguration';
import { IContainer, Token, LoadType, isFunction, isToken } from '@ts-ioc/core';
import { CustomMiddleware } from './middlewares';
import { ApplicationEvents, ApplicationBuilder } from '@ts-ioc/bootstrap';
import { ServerListenerToken } from './IListener';
import { IApplication } from './IApplication';
import { MvcModule } from './MvcModule';
import { IMvcServer, IMvcHostBuilder, MvcServerToken } from './IMvcServer';

/**
 * load type or middleware.
 */
export type LoadTypeOrMiddleware = LoadType | CustomMiddleware;

/**
 * mvc applaction builder.
 *
 * @export
 * @class AppBuilder
 */
export class MvcHostBuilder extends ApplicationBuilder<IMvcServer> implements IMvcHostBuilder  {

    middlewares: CustomMiddleware[];
    /**
     * Creates an instance of WebApplication.
     * @param {string} rootdir
     * @param {Type<any>} [appType]
     * @memberof WebApplication
     */
    constructor(baseURL?: string) {
        super(baseURL)
        this.use(MvcModule);
        this.middlewares = [];
    }

    /**
     * create new application.
     *
     * @static
     * @param {string} [rootdir]
     * @returns
     * @memberof WebApplication
     */
    static create(rootdir?: string): MvcHostBuilder {
        return new MvcHostBuilder(rootdir);
    }

    use(...modules: LoadTypeOrMiddleware[]): this {
        modules.forEach(m => {
            if (isToken(m)) {
                super.use(m);
            } else if (isFunction(m)) {
                this.middlewares.push(m);
            } else {
                super.use(m);
            }
        })
        return this;
    }


    useListener(listener: Function) {
        this.provider(ServerListenerToken, () => listener);
    }

    /**
     * bootstrap mvc application with App Module.
     *
     * @param {Token<any>} [app]
     * @returns {Promise<T>}
     * @memberof Bootstrap
     */
    async bootstrap(app?: Token<any> | IConfiguration): Promise<IApplication> {
        let appType = app || MvcServerToken;
        let instance = await super.bootstrap(appType) as IApplication;
        return instance;
    }

    /**
     * run application.
     *
     * @param {(Token<any> | IConfiguration)} [app]
     * @returns {Promise<IApplication>}
     * @memberof MvcContainer
     */
    run(app?: Token<any> | IConfiguration): Promise<IApplication> {
        return this.bootstrap(app);
    }

}
