import { Singleton } from '@ts-ioc/core';
import { IApplication, AppModuleBuilderToken } from '../IApplication';
import { ModuleBuilder } from '@ts-ioc/bootstrap';


/**
 * mvc applaction module builder.
 *
 * @export
 * @class AppModuleBuilder
 */
@Singleton(AppModuleBuilderToken)
export class AppModuleBuilder extends ModuleBuilder<IApplication> {

}

