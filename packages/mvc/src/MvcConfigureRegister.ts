import { ConfigureRegister, RunnableBuilder } from '@ts-ioc/bootstrap';
import { DebugLogAspect } from '@ts-ioc/logs';
import { Singleton, IContainer, lang, ContainerBuilder } from '@ts-ioc/core';
import { IConfiguration } from './IConfiguration';
import { ServerModule } from '@ts-ioc/platform-server';

@Singleton
export class MvcConfigureRegister extends ConfigureRegister<IConfiguration> {
    constructor() {
        super();
    }
    async register(config: IConfiguration, container: IContainer, builder: RunnableBuilder<any>): Promise<void> {
        if (config.debug) {
            container.register(DebugLogAspect);
        }
        // console.log(builder.getPools().values().length);
        let topContainer = builder.getPools().values().find(c => lang.getClass(c.getBuilder()) !== ContainerBuilder);
        builder.getPools().values()
            .forEach(c => {
                console.log(c.hasRegister(ServerModule));
                console.log(c.getBuilder().constructor);
            });
        // lang.assert(topContainer, 'not set run env. use @ts-ioc/platform-server or @ts-ioc/platform-brow(ser');
        // console.log(config, container);
        if (config.controllers) {
            await topContainer.loadModule({ files: config.controllers });
        }
        if (config.middlewares) {
            await topContainer.loadModule({ files: config.middlewares });
        }
        if (config.aop) {
            await topContainer.loadModule({ files: config.aop });
        }
    }
}
