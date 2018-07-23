import { IClassDecorator, createClassDecorator, TypeMetadata } from '@ts-ioc/core';
import { IConfiguration } from '../IConfiguration';


export interface IAppModuleMetadata extends IConfiguration, TypeMetadata {

}

/**
 * Bootstrap Decorator, definde class as mvc bootstrap module.
 *
 * @Bootstrap
 */
export const Bootstrap: IClassDecorator<IAppModuleMetadata> = createClassDecorator<IAppModuleMetadata>('Bootstrap');
