import { createDIModuleDecorator } from '@tsdi/boot';
import { ITypeDecorator, isClass, isFunction } from '@tsdi/ioc';
import { MvcModuleMetadata } from '../metadata';

/**
 * MvcModule decorator, use to define class as mvc Module.
 *
 * @export
 * @interface IMvcModuleDecorator
 * @extends {ITypeDecorator<T>}
 * @template T
 */
export interface IMvcModuleDecorator<T extends MvcModuleMetadata> extends ITypeDecorator<T> {
    /**
     * MvcModule decorator, use to define class as mvc Module.
     *
     * @MvcModule
     *
     * @param {T} [metadata] bootstrap metadate config.
     */
    (metadata: T): ClassDecorator;
}

/**
 * MvcModule Decorator, definde class as mvc module.
 *
 * @MvcModule
 */
export const MvcModule: IMvcModuleDecorator<MvcModuleMetadata> = createDIModuleDecorator<MvcModuleMetadata>('MvcModule', null, (metadata: MvcModuleMetadata) => {

    // static main.
    if (isClass(metadata.type) && isFunction(metadata.type['main'])) {
        setTimeout(() => {
            metadata.type['main'](metadata);
        }, 100);
    }
    return metadata;
}) as IMvcModuleDecorator<MvcModuleMetadata>;
