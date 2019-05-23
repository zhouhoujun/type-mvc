import { ConfigureRegister } from '@tsdi/boot';
import { DebugLogAspect } from '@tsdi/logs';
import { Singleton, isToken, isClass } from '@tsdi/ioc';
import { IConfiguration } from './IConfiguration';
import { DefaultModelParserToken } from '@mvx/model';

@Singleton
export class MvcConfigureRegister extends ConfigureRegister {
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
            // this.container.bindProvider(DefaultModelParserToken, config.modelParser);
        }
    }
}
