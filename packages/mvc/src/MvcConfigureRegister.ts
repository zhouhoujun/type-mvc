import { ConfigureRegister, RunnableConfigure } from '@ts-ioc/bootstrap';
import { DebugLogAspect } from '@ts-ioc/logs';
import { Singleton, IContainer, isArray } from '@ts-ioc/core';
import { IConfiguration } from './IConfiguration';

@Singleton
export class MvcConfigureRegister extends ConfigureRegister<RunnableConfigure> {
    constructor() {
        super();
    }
    async register(config: IConfiguration, container: IContainer): Promise<void> {
        if (config.debug) {
            container.register(DebugLogAspect);
        }
        if (config.controllers) {
            await container.loadModule(config.controllers);
        }
        if (config.middlewares) {
            await container.loadModule(config.middlewares);
        }
        if (config.aop) {
            await container.loadModule(config.aop);
        }
    }
}
