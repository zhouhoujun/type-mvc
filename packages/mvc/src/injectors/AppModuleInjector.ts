import { InjectModuleInjectorToken, Injectable, Inject, IModuleValidate } from '@ts-ioc/core';
import { App } from '../decorators';
import { DIModuleInjector } from '@ts-ioc/bootstrap';
import { AppModuleValidateToken } from './AppModuleValidate';

/**
 * workflow module injector token.
 */
export const AppModuleInjectorToken = new InjectModuleInjectorToken(App.toString());
/**
 * workflow module injector
 *
 * @export
 * @class AppModuleInjector
 * @extends {DIModuleInjector}
 */
@Injectable(AppModuleInjectorToken)
export class AppModuleInjector extends DIModuleInjector {

    constructor(@Inject(AppModuleValidateToken) validate: IModuleValidate) {
        super(validate)
    }
}
