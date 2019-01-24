import { ConfigureRegister, RunnableConfigure, RunnableBuilder } from '@ts-ioc/bootstrap';
import { DebugLogAspect } from '@ts-ioc/logs';
import { Singleton, IContainer, ContainerBuilder, lang } from '@ts-ioc/core';
import { IConfiguration } from './IConfiguration';

@Singleton
export class MvcConfigureRegister extends ConfigureRegister<RunnableConfigure> {
    constructor() {
        super();
    }
    async register(config: IConfiguration, container: IContainer, builder: RunnableBuilder<any>): Promise<void> {
        if (config.debug) {
            container.register(DebugLogAspect);
        }
        // console.log(builder.getPools().values().length);
        // let topContainer = builder.getPools().values().find(c => lang.getClass(c.getBuilder()) !== ContainerBuilder);
        // lang.assert(topContainer, 'not set run env. use @ts-ioc/platform-server or @ts-ioc/platform-brow(ser');
        console.log(container.parent);
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
