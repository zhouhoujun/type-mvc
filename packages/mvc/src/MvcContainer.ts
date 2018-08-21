import { IConfiguration, ConfigurationToken } from './IConfiguration';
import { Configuration } from './Configuration';
import { IContainer, isFunction, Token, LoadType, isToken } from '@ts-ioc/core';
import { Log4jsAdapter } from './logAdapter/Log4jsAdapter';
import { AopModule } from '@ts-ioc/aop';
import { LogModule } from '@ts-ioc/logs';
import { CustomMiddleware } from './middlewares';
import { IApplicationBuilder, Runnable, DefaultConfigureToken, AppConfigureLoaderToken, IApplicationExtends, AppConfigure, DefaultModuleBuilderToken } from '@ts-ioc/bootstrap';

import { Application } from './Application';
import { CoreModule } from './CoreModule';
import { ApplicationBuilder, ConfigureFileLoader } from '@ts-ioc/platform-server/bootstrap';
import { ServerListenerToken } from './IListener';
import { AppModuleBuilderToken } from './IApplication';


/**
 * mvc applaction builder.
 *
 * @export
 * @class AppBuilder
 */
export class MvcContainer implements IApplicationExtends {

    middlewares: CustomMiddleware[];
    /**
     * Creates an instance of WebApplication.
     * @param {string} rootdir
     * @param {Type<any>} [appType]
     * @memberof WebApplication
     */
    constructor(public rootdir: string) {
        this.middlewares = [];
    }

    protected container: IContainer;
    getContainer(): IContainer {
        if (!this.container) {
            this.container = this.getBuilder().getPools().getDefault();
        }
        return this.container;
    }


    protected builder: IApplicationBuilder<any>;
    getBuilder<T>(): IApplicationBuilder<T> {
        if (!this.builder) {
            this.builder = this.createAppBuilder();
            this.builder
                .use(AopModule)
                .use(LogModule)
                .use(CoreModule)
                .use(Log4jsAdapter)
                .use(ConfigureFileLoader)
                .provider(DefaultConfigureToken, Configuration)
                .provider(DefaultModuleBuilderToken, AppModuleBuilderToken)
                // .provider(DefaultAnnotationBuilderToken, AppBuilder)
                .provider(AppConfigureLoaderToken, ConfigureFileLoader);
        }
        return this.builder;
    }

    protected createAppBuilder() {
        return new ApplicationBuilder(this.rootdir);
    }

    /**
     * create new application.
     *
     * @static
     * @param {string} rootdir
     * @returns
     * @memberof WebApplication
     */
    static create(rootdir: string) {
        return new MvcContainer(rootdir);
    }


    /**
     * use module, middleware or CustomMiddleware.
     *
     * @param {...(CustomMiddleware | LoadType)[]} middleware
     * @returns {this}
     * @memberof Bootstrap
     */
    use(...modules: (CustomMiddleware | LoadType)[]): this {
        let appBuilder = this.getBuilder();
        modules.forEach(md => {
            if (isToken(md)) {
                appBuilder.use(md);
            } else if (isFunction(md)) {
                this.middlewares.push(md);
            }
        });

        return this;
    }

    useConfiguration(config?: string | AppConfigure): this {
        this.getBuilder().useConfiguration(config);
        return this;
    }

    provider(provide: Token<any>, provider: any): this {
        this.getBuilder().provider(provide, provider);
        return this;
    }


    useListener(listener: Function) {
        this.getBuilder().provider(ServerListenerToken, () => listener);
    }

    /**
     * bootstrap mvc application with App Module.
     *
     * @template T
     * @param {Token<T>} [app]
     * @returns {Promise<T>}
     * @memberof Bootstrap
     */
    async bootstrap<T>(app?: Token<T> | IConfiguration): Promise<Runnable<T>> {
        let appType = app || Application;
        let instance = await this.getBuilder<T>().bootstrap(appType);
        return instance;
    }

}
