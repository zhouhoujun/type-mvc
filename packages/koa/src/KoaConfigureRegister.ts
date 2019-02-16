import { ConfigureRegister } from '@ts-ioc/bootstrap';
import { Singleton } from '@ts-ioc/core';
import { IConfiguration } from '@mvx/mvc';


@Singleton
export class KoaConfigureRegister extends ConfigureRegister<IConfiguration> {
    constructor() {
        super();
    }
    async register(config: IConfiguration): Promise<void> {
        if (config.controllers) {
            await this.container.loadModule({ files: config.controllers, basePath: config.baseURL });
        }
        if (config.middlewares) {
            await this.container.loadModule({ files: config.middlewares, basePath: config.baseURL });
        }
        if (config.aop) {
            await this.container.loadModule({ files: config.aop, basePath: config.baseURL });
        }
    }
}
