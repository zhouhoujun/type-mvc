import { Authenticator } from './Authenticator';
import { Abstract, Inject, Injectable } from '@tsdi/ioc';
import { IConfiguration, IStrategyOption, IContext } from '@mvx/mvc';
import { IStrategy } from './IStrategy';
import { ComponentBuilder, ElementDecoratorRegisterer, Component, ComponentSelectorHandle } from '@tsdi/components';
import { Strategy } from './Strategy';
import { IContainer, ContainerToken } from '@tsdi/core';
import { SerializeUser, DeserializeUser, TransformAuthInfo } from '../services';
import { StrategySelectorHandle } from './StrategySelectorHandle';
import { BuildHandleRegisterer } from '@tsdi/boot';

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
        let register = this.container.get(BuildHandleRegisterer);
        if (!register.get(StrategySelectorHandle)) {
            this.container.get(BuildHandleRegisterer).register(this.container, StrategySelectorHandle);
            this.container.get(ElementDecoratorRegisterer)
                .registerBefore(Component, ComponentSelectorHandle, StrategySelectorHandle);
        }
        if (configuration.passports) {
            let { strategies, serializers, deserializers, authInfos } = configuration.passports;
            if (strategies.length) {
                await Promise.all(strategies.map(async p => {
                    let strategy = await this.createStrategy(p);
                    if (strategy instanceof Strategy) {
                        console.log(strategy);
                        passport.use(strategy);
                    }
                }));
            }

            if (serializers && serializers.length) {
                serializers.forEach(ser => {
                    if (!this.container.has(ser)) {
                        this.container.register(ser);
                    }
                    passport.serializeUser((user, ctx) => this.container.resolve(ser).serializeUser(user, ctx as IContext));
                });
            } else {
                this.container.getServices(SerializeUser)
                    .forEach(ser => {
                        passport.serializeUser((user, ctx) => ser.serializeUser(user, ctx as IContext))
                    });
            }

            if (deserializers && deserializers.length) {
                deserializers.forEach(ser => {
                    if (!this.container.has(ser)) {
                        this.container.register(ser);
                    }

                    passport.deserializeUser((obj, ctx) => this.container.resolve(ser).deserializeUser(obj, ctx as IContext));
                });
            } else {
                this.container.getServices(DeserializeUser)
                    .forEach(ser => {
                        passport.deserializeUser((obj, ctx) => ser.deserializeUser(obj, ctx as IContext))
                    });
            }

            if (authInfos && authInfos.length) {
                authInfos.forEach(ser => {
                    if (!this.container.has(ser)) {
                        this.container.register(ser);
                    }

                    passport.transformAuthInfo((info, ctx) => this.container.resolve(ser).authInfo(info, ctx as IContext));
                });
            } else {
                this.container.getServices(TransformAuthInfo)
                    .forEach(ser => {
                        passport.transformAuthInfo((info, ctx) => ser.authInfo(info, ctx))
                    });
            }
        }
    }
}
