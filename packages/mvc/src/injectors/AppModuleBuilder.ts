import { Singleton, IContainer, lang } from '@ts-ioc/core';
import { IApplication, AppModuleBuilderToken } from '../IApplication';
import { AppConfigureToken } from '@ts-ioc/bootstrap';
import { IConfiguration, ConfigurationToken } from '../IConfiguration';
import { LogConfigureToken } from '@ts-ioc/logs';
import { DebugLogAspect, AuthAspect } from '../aop';
import { Configuration } from '../Configuration';
import { ApplicationBuilder } from '@ts-ioc/platform-server/bootstrap';

/**
 * mvc applaction module builder.
 *
 * @export
 * @class AppModuleBuilder
 */
@Singleton(AppModuleBuilderToken)
export class AppModuleBuilder extends ApplicationBuilder<IApplication> {

    protected async registerExts(container: IContainer, config: IConfiguration): Promise<IContainer> {
        await super.registerExts(container, config);

        let globCfg = container.get(AppConfigureToken) as IConfiguration;
        globCfg.rootdir = globCfg.rootdir || globCfg.baseURL;
        config = lang.assign(globCfg, config) as IConfiguration;
        container.bindProvider(ConfigurationToken, config);
        container.bindProvider(Configuration, config as Configuration);

        let builder = container.getBuilder();
        // custom config.
        if (config.middlewares) {
            let modules = await builder.loadModule(container, {
                basePath: config.rootdir,
                files: config.middlewares
            });
            config.useMiddlewares = modules;

        }

        if (config.controllers) {
            let controllers = await builder.loadModule(container, {
                basePath: config.rootdir,
                files: config.controllers
            });
            if (!config.usedControllers || config.usedControllers.length < 1) {
                config.usedControllers = controllers;
            }
        }

        if (config.logConfig) {
            container.registerSingleton(LogConfigureToken, config.logConfig);
        }

        if (config.debug) {
            container.register(DebugLogAspect);
        }
        container.register(AuthAspect);

        if (config.aop) {
            let aops = await builder.loadModule(container, {
                basePath: config.rootdir,
                files: config.aop
            });

            config.usedAops = aops;
        }
        return container;
    }

}

