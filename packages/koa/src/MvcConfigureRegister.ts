import { ConfigureRegister, RunnableConfigure, RunnableBuilder } from '@ts-ioc/bootstrap';
import { DebugLogAspect } from '@ts-ioc/logs';
import { Singleton, IContainer } from '@ts-ioc/core';
import { IConfiguration } from '@mvx/mvc';

@Singleton
export class MvcConfigureRegister extends ConfigureRegister<RunnableConfigure> {
    constructor() {
        super();
    }
    async register(config: IConfiguration, container: IContainer, builder: RunnableBuilder<any>): Promise<void> {
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
