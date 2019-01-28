import { ConfigureRegister } from '@ts-ioc/bootstrap';
import { DebugLogAspect } from '@ts-ioc/logs';
import { Singleton, IContainer } from '@ts-ioc/core';
import { IConfiguration } from './IConfiguration';

@Singleton
export class MvcConfigureRegister extends ConfigureRegister<IConfiguration> {
    constructor() {
        super();
    }
    async register(config: IConfiguration, container: IContainer): Promise<void> {
        if (config.debug) {
            container.register(DebugLogAspect);
        }

        if (config.controllers) {
            await container.loadModule({ files: config.controllers });
        }
        if (config.middlewares) {
            await container.loadModule({ files: config.middlewares });
        }
        if (config.aop) {
            await container.loadModule({ files: config.aop });
        }
    }
}
