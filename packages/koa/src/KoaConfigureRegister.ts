import { ConfigureRegister } from '@tsdi/boot';
import { Singleton } from '@tsdi/ioc';
import { IConfiguration } from '@mvx/mvc';


@Singleton
export class KoaConfigureRegister extends ConfigureRegister {
    constructor() {
        super();
    }
    async register(config: IConfiguration): Promise<void> {
        if (config.controllers) {
            await this.container.load({ files: config.controllers, basePath: config.baseURL });
        }
        if (config.middlewares) {
            await this.container.load({ files: config.middlewares, basePath: config.baseURL });
        }
        if (config.aop) {
            await this.container.load({ files: config.aop, basePath: config.baseURL });
        }
    }
}
