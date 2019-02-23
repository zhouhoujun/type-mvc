import { ConfigureRegister } from '@ts-ioc/bootstrap';
import { DebugLogAspect } from '@ts-ioc/logs';
import { Singleton, isToken, isClass } from '@ts-ioc/core';
import { IConfiguration } from './IConfiguration';
import { DefaultModelParserToken } from '@mvx/model';

@Singleton
export class MvcConfigureRegister extends ConfigureRegister<IConfiguration> {
    constructor() {
        super();
    }
    async register(config: IConfiguration): Promise<void> {
        if (config.debug) {
            this.container.register(DebugLogAspect);
        }
        if (isToken(config.modelParser)) {
            if (isClass(config.modelParser) && !this.container.has(config.modelParser)) {
                this.container.register(config.modelParser);
            }
            this.container.bindProvider(DefaultModelParserToken, config.modelParser);
        }
    }
}
