import { IConfiguration } from '../IConfiguration';
import { createDIModuleDecorator, IDIModuleDecorator, ModuleBuilderToken, AnnotationBuilderToken } from '@ts-ioc/bootstrap';
import { ApplicationToken } from '../IApplication';


export interface IAppMetadata extends IConfiguration {

}

/**
 * App decorator, use to define class as mvc application.
 *
 * @export
 * @interface IAppDecorator
 * @extends {IDIModuleDecorator<T>}
 * @template T
 */
export interface IAppDecorator<T extends IAppMetadata> extends IDIModuleDecorator<T> {
    /**
     * App decorator, use to define class as mvc application.
     *
     * @App
     *
     * @param {T} [metadata] mvc application metadate config.
     */
    (metadata: T): ClassDecorator;
}

/**
 * App decorator, define the class as mvc application.
 * @App
 */
export const App = createDIModuleDecorator<IAppMetadata>('App', ModuleBuilderToken, AnnotationBuilderToken, null,
    metadata => {
        if (!metadata.defaultRunnable) {
            metadata.defaultRunnable = ApplicationToken;
        }
        return metadata;
    });
