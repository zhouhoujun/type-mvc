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
        // console.log(builder.getPools().values().length);
        // let topContainer = builder.getPools().values().find(c => lang.getClass(c.getBuilder()) !== ContainerBuilder);
        // lang.assert(topContainer, 'not set run env. use @ts-ioc/platform-server or @ts-ioc/platform-brow(ser');
        // console.log(container.parent);
        if (config.controllers) {
            await this.container.loadModule({ files: config.controllers });
        }
        if (config.middlewares) {
            await this.container.loadModule({ files: config.middlewares });
        }
        if (config.aop) {
            await this.container.loadModule({ files: config.aop });
        }
    }
}
