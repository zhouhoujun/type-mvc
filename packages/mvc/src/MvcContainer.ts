import { IConfiguration } from './IConfiguration';
import { Configuration } from './Configuration';
import { IContainer, Token } from '@ts-ioc/core';
import { Log4jsAdapter } from './logAdapter/Log4jsAdapter';
import { AopModule } from '@ts-ioc/aop';
import { LogModule } from '@ts-ioc/logs';
import { CustomMiddleware } from './middlewares';
import {
    Runnable, DefaultConfigureToken,
    AppConfigureLoaderToken, DefaultModuleBuilderToken,
    DefaultAnnotationBuilderToken, ApplicationEvents, IApplication
} from '@ts-ioc/bootstrap';
import { CoreModule } from './CoreModule';
import { ConfigureFileLoader, ApplicationBuilder, IApplicationBuilderServer } from '@ts-ioc/platform-server/bootstrap';
import { ServerListenerToken } from './IListener';
import { AppMetaAccessor, AppModuleValidate, AppModuleInjector, AppModuleInjectorToken, AppBuilder, AppModuleBuilder } from './injectors';
import { Application } from './Application';


/**
 * mvc applaction builder.
 *
 * @export
 * @class AppBuilder
 */
export class MvcContainer extends ApplicationBuilder<IApplication> implements IApplicationBuilderServer<IApplication> {

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
            container.register(AppMetaAccessor)
                .register(AppModuleValidate)
                .register(AppModuleInjector);
            let chain = container.getBuilder().getInjectorChain(container);
            chain.first(container.resolve(AppModuleInjectorToken));
        });
    }

    protected async initRootContainer(container: IContainer) {
        this.use(AopModule, LogModule, CoreModule, Log4jsAdapter)
            .provider(DefaultConfigureToken, Configuration, true)
            .provider(DefaultModuleBuilderToken, AppModuleBuilder)
            .provider(DefaultAnnotationBuilderToken, AppBuilder)
            .provider(AppConfigureLoaderToken, ConfigureFileLoader);

        await super.initRootContainer(container);
    }

    /**
     * create new application.
     *
     * @static
     * @param {string} rootdir
     * @returns
     * @memberof WebApplication
     */
    static create(rootdir: string): MvcContainer {
        return new MvcContainer(rootdir);
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
    async bootstrap(app?: Token<IApplication> | IConfiguration): Promise<Runnable<IApplication>> {
        let appType = app || Application;
        let instance = await super.bootstrap(appType);
        return instance;
    }

    /**
     * run application.
     *
     * @param {(Token<IApplication> | IConfiguration)} [app]
     * @returns {Promise<Runnable<IApplication>>}
     * @memberof MvcContainer
     */
    run(app?: Token<IApplication> | IConfiguration): Promise<Runnable<IApplication>> {
        return this.bootstrap(app);
    }

}
