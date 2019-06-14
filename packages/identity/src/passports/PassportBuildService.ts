import { Authenticator } from './Authenticator';
import { Abstract, Inject, Injectable } from '@tsdi/ioc';
import { IConfiguration, IStrategyOption, IContext } from '@mvx/mvc';
import { IStrategy } from './IStrategy';
import { ComponentBuilder } from '@tsdi/components';
import { Strategy } from './Strategy';
import { IContainer, ContainerToken } from '@tsdi/core';

/**
 * 
 *
 * @export
 * @abstract
 * @class PassportBuildService
 */
@Abstract()
export abstract class PassportBuildService {

    @Inject()
    private builder: ComponentBuilder;

    abstract build(passport: Authenticator, configuration: IConfiguration): Promise<void>;

    async createStrategy(option: IStrategyOption): Promise<IStrategy> {
        return await this.builder.resolveTemplate({ template: option }) as IStrategy;
    }
}


/**
 * register passport strategy in configuare.
 *
 * @export
 * @class ConfigurePassportBuildService
 * @extends {PassportBuildService}
 */
@Injectable()
export class ConfigurePassportBuildService extends PassportBuildService {

    @Inject(ContainerToken)
    private container: IContainer;

    async build(passport: Authenticator, configuration: IConfiguration): Promise<void> {
        if (configuration.passports) {
            let { strategies, serializers, deserializers } = configuration.passports;
            if (strategies.length) {
                await Promise.all(strategies.map(async p => {
                    let strategy = await this.createStrategy(p);
                    console.log(strategy);
                    if (strategy instanceof Strategy) {
                        passport.use(strategy);
                    }
                }));
            }

            if (serializers && serializers.length) {
                serializers.forEach(ser => {
                    if (!this.container.has(ser)) {
                        this.container.register(ser);
                    }

                    passport.serializeUser((obj, ctx) => this.container.get(ser).serializeUser(obj, ctx as IContext));
                });
            }

            if (deserializers && deserializers.length) {
                deserializers.forEach(ser => {
                    if (!this.container.has(ser)) {
                        this.container.register(ser);
                    }

                    passport.deserializeUser((obj, ctx) => this.container.get(ser).deserializeUser(obj, ctx as IContext));
                });
            }
        }
    }
}
