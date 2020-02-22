import { Abstract, Inject, Injectable, isClass, isFunction, INJECTOR, ActionInjectorToken } from '@tsdi/ioc';
import { ICoreInjector } from '@tsdi/core';
import { StartupDecoratorRegisterer, StartupScopes } from '@tsdi/boot';
import { ComponentBuilder, Component, ComponentSelectorHandle } from '@tsdi/components';
import { IConfiguration, IContext } from '@mvx/mvc';
import { IStrategy } from './IStrategy';
import { Strategy } from './Strategy';
import { StrategySelectorHandle } from './StrategySelectorHandle';
import { IStrategyOption, IAuthenticator } from './IAuthenticator';
import { SerializeUser, DeserializeUser, TransformAuthInfo } from '../services';

/**
 * PassportBuildService
 *
 * @export
 * @abstract
 * @class PassportBuildService
 */
@Abstract()
export abstract class PassportBuildService {

    @Inject()
    private builder: ComponentBuilder;

    abstract build(passport: IAuthenticator, configuration: IConfiguration): Promise<void>;

    async createStrategy(option: IStrategyOption): Promise<IStrategy> {
        let temRef = await this.builder.resolveTemplate({ template: option });
        return temRef.rootNodes[0]  as IStrategy;
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

    @Inject(INJECTOR)
    private injector: ICoreInjector;

    async build(passport: IAuthenticator, configuration: IConfiguration): Promise<void> {
        let actInj = this.injector.getInstance(ActionInjectorToken);
        let register = actInj.getInstance(StartupDecoratorRegisterer).getRegisterer(StartupScopes.TranslateTemplate);
        if (!register.has(StrategySelectorHandle)) {
            register.registerBefore(Component, ComponentSelectorHandle, StrategySelectorHandle);
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
                        if (!this.injector.has(ser)) {
                            this.injector.register(ser);
                        }
                        passport.serializeUser((user, ctx) => this.injector.resolve(ser).serializeUser(user, ctx as IContext));
                    } else if (isFunction(ser)) {
                        passport.serializeUser(ser);
                    }
                });
            } else {
                this.injector.getServices(SerializeUser)
                    .forEach(ser => {
                        passport.serializeUser((user, ctx) => ser.serializeUser(user, ctx as IContext))
                    });
            }

            if (deserializers && deserializers.length) {
                deserializers.forEach(desr => {
                    if (isClass(desr)) {
                        if (!this.injector.has(desr)) {
                            this.injector.register(desr);
                        }
                        passport.deserializeUser((obj, ctx) => this.injector.resolve(desr).deserializeUser(obj, ctx as IContext));
                    } else if (isFunction(desr)) {
                        passport.deserializeUser(desr);
                    }
                });
            } else {
                this.injector.getServices(DeserializeUser)
                    .forEach(desr => {
                        passport.deserializeUser((obj, ctx) => desr.deserializeUser(obj, ctx as IContext))
                    });
            }

            if (authInfos && authInfos.length) {
                authInfos.forEach(trans => {
                    if (isClass(trans)) {
                        if (!this.injector.has(trans)) {
                            this.injector.register(trans);
                        }
                        passport.transformAuthInfo((info, ctx) => this.injector.resolve(trans).authInfo(info, ctx as IContext));
                    } else if (isFunction(trans)) {
                        passport.transformAuthInfo(trans);
                    }
                });
            } else {
                this.injector.getServices(TransformAuthInfo)
                    .forEach(ser => {
                        passport.transformAuthInfo((info, ctx) => ser.authInfo(info, ctx))
                    });
            }
        }
    }
}
