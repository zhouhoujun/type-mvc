import { ConfigureRegister, IRunnableBuilder } from '@ts-ioc/bootstrap';
import { DebugLogAspect } from '@ts-ioc/logs';
import { Singleton } from '@ts-ioc/core';
import { IConfiguration } from '@mvx/mvc';

@Singleton
export class MvcConfigureRegister extends ConfigureRegister<IConfiguration> {
    constructor() {
        super();
    }
    async register(config: IConfiguration, builder?: IRunnableBuilder<any>): Promise<void> {
        if (config.debug) {
            this.container.register(DebugLogAspect);
        }

        if (config.controllers) {
            await this.container.loadModule({ files: config.controllers, basePath: config.baseURL });
        }
        if (config.middlewares) {
            await this.container.loadModule({ files: config.middlewares, basePath: config.baseURL });
        }
        if (config.aop) {
            await this.container.loadModule({ files: config.aop });
        }
    }
}
