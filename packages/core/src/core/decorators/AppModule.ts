import { IClassDecorator, createClassDecorator, TypeMetadata } from '@ts-ioc/core';
import { IConfiguration } from '../../IConfiguration';


export interface IAppModuleMetadata extends IConfiguration, TypeMetadata {

}

/**
 * AppModule Decorator, definde class as mvc bootstrap module.
 *
 * @AppModule
 */
export const AppModule: IClassDecorator<IAppModuleMetadata> = createClassDecorator<IAppModuleMetadata>('AppModule', null, (metadata) => {
    metadata.singleton = true;
    return metadata;
});
