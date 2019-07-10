import { Authenticator } from './Authenticator';
import { Abstract, Inject, Injectable, isClass, isFunction } from '@tsdi/ioc';
import { IConfiguration, IStrategyOption, IContext } from '@mvx/mvc';
import { IStrategy } from './IStrategy';
import { ComponentBuilder, Component, ComponentSelectorHandle } from '@tsdi/components';
import { Strategy } from './Strategy';
import { IContainer, ContainerToken } from '@tsdi/core';
import { SerializeUser, DeserializeUser, TransformAuthInfo } from '../services';
import { StrategySelectorHandle } from './StrategySelectorHandle';
import { StartupDecoratorRegisterer, StartupScopes, HandleRegisterer } from '@tsdi/boot';

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
        let startRegister = this.container.get(StartupDecoratorRegisterer);
        let register = startRegister.getRegisterer(StartupScopes.Build);
        if (!register.get(StrategySelectorHandle)) {
            this.container.get(HandleRegisterer).register(this.container, StrategySelectorHandle);
            startRegister.getRegisterer(StartupScopes.TranslateTemplate)
                .registerBefore(Component, ComponentSelectorHandle, StrategySelectorHandle);
        }
        if (configuration.passports) {
            let { strategies, serializers, deserializers, authInfos } = configuration.passports;
            if (strategies.length) {
                await Promise.all(strategies.map(async p => {
                    let strategy = await this.createStrategy(p);
                    if (strategy instanceof Strategy) {
                        passport.use(strategy);
                    }
                }));
            }

            if (serializers && serializers.length) {
                serializers.forEach(ser => {
                    if (isClass(ser)) {
                        if (!this.container.has(ser)) {
                            this.container.register(ser);
                        }
                        passport.serializeUser((user, ctx) => this.container.resolve(ser).serializeUser(user, ctx as IContext));
                    } else if (isFunction(ser)) {
                        passport.serializeUser(ser);
                    }
                });
            } else {
                this.container.getServices(SerializeUser)
                    .forEach(ser => {
                        passport.serializeUser((user, ctx) => ser.serializeUser(user, ctx as IContext))
                    });
            }

            if (deserializers && deserializers.length) {
                deserializers.forEach(desr => {
                    if (isClass(desr)) {
                        if (!this.container.has(desr)) {
                            this.container.register(desr);
                        }
                        passport.deserializeUser((obj, ctx) => this.container.resolve(desr).deserializeUser(obj, ctx as IContext));
                    } else if (isFunction(desr)) {
                        passport.deserializeUser(desr);
                    }
                });
            } else {
                this.container.getServices(DeserializeUser)
                    .forEach(desr => {
                        passport.deserializeUser((obj, ctx) => desr.deserializeUser(obj, ctx as IContext))
                    });
            }

            if (authInfos && authInfos.length) {
                authInfos.forEach(trans => {
                    if (isClass(trans)) {
                        if (!this.container.has(trans)) {
                            this.container.register(trans);
                        }
                        passport.transformAuthInfo((info, ctx) => this.container.resolve(trans).authInfo(info, ctx as IContext));
                    } else if (isFunction(trans)) {
                        passport.transformAuthInfo(trans);
                    }
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
