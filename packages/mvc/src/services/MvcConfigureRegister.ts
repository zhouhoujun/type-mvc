import { ConfigureRegister } from '@tsdi/boot';
import { IConfiguration } from '../IConfiguration';
import { MvcContext } from '../MvcContext';
import { Injectable } from '@tsdi/ioc';
import { LogConfigureToken, ConfigureLoggerManger } from '@tsdi/logs';

@Injectable()
export class MvcConfigureRegister extends ConfigureRegister {

    async register(config: IConfiguration, ctx?: MvcContext): Promise<void> {
        let logConfig =  config.logConfig || ctx.annoation.logConfig;
        this.container.bindProvider(LogConfigureToken, logConfig);
        ctx.logManager = this.container.resolve(ConfigureLoggerManger);
    }
}
