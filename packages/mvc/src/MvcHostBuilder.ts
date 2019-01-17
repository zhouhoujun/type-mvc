import { IConfiguration } from './IConfiguration';
import { Configuration } from './Configuration';
import { IContainer, Token } from '@ts-ioc/core';
import { Log4jsAdapter } from './logAdapter/Log4jsAdapter';
import { CustomMiddleware } from './middlewares';
import {
    Runnable, ApplicationEvents, ApplicationBuilder
} from '@ts-ioc/bootstrap';
import { ServerListenerToken } from './IListener';
import { AppModuleValidate, AppModuleInjector, AppModuleInjectorToken} from './injectors';
import { IMvcServer, IApplication } from './IApplication';
import { MvcModule } from './MvcModule';


/**
 * mvc applaction builder.
 *
 * @export
 * @class AppBuilder
 */
export class MvcHostBuilder extends ApplicationBuilder<IMvcServer>  {

    middlewares: CustomMiddleware[];
    /**
     * Creates an instance of WebApplication.
     * @param {string} rootdir
     * @param {Type<any>} [appType]
     * @memberof WebApplication
     */
    constructor(public baseURL: string) {
        super(baseURL)
        this.middlewares = [];
    }

    protected initEvents() {
        super.initEvents();
        this.on(ApplicationEvents.onRootContainerCreated, (container: IContainer) => {
            container.register(AppModuleValidate)
                .register(AppModuleInjector);
            let chain = container.getBuilder().getInjectorChain(container);
            chain.first(container.resolve(AppModuleInjectorToken));
        });
    }

    /**
     * create new application.
     *
     * @static
     * @param {string} rootdir
     * @returns
     * @memberof WebApplication
     */
    static create(rootdir: string): MvcHostBuilder {
        return new MvcHostBuilder(rootdir);
    }


    useListener(listener: Function) {
        this.provider(ServerListenerToken, () => listener);
    }

    /**
     * bootstrap mvc application with App Module.
     *
     * @param {Token<T>} [app]
     * @returns {Promise<T>}
     * @memberof Bootstrap
     */
    async bootstrap(app?: Token<IMvcServer> | IConfiguration): Promise<Runnable<IApplication>> {
        let appType = app || MvcApplication;
        let instance = await super.bootstrap(appType);
        return instance;
    }

    /**
     * run application.
     *
     * @param {(Token<IMvcServer> | IConfiguration)} [app]
     * @returns {Promise<IApplication>}
     * @memberof MvcContainer
     */
    run(app?: Token<IMvcServer> | IConfiguration): Promise<IApplication> {
        return this.bootstrap(app);
    }

}
