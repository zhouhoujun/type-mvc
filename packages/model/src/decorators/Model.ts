import {
    isString, TypeMetadata, IClassMethodDecorator, MetadataAdapter,
    MetadataExtends, createClassDecorator, IClassDecorator
} from '@tsdi/ioc';
import { ModelMetadata } from '../metadata';


/**
 * model decorator type define.
 *
 * @export
 * @interface IModelDecorator
 * @template T
 */
export interface IModelDecorator<T extends ModelMetadata> extends IClassDecorator<T> {
    (dbtable?: string): ClassDecorator;
}

/**
 * create filed decorator.
 *
 * @export
 * @template T
 * @param {string} [modelType]
 * @param {MetadataAdapter} [adapter]
 * @param {MetadataExtends<T>} [metaExtends]
 * @returns {IFiledDecorator<T>}
 */
export function createModelDecorator<T extends ModelMetadata>(
    modelType?: string,
    adapter?: MetadataAdapter,
    metaExtends?: MetadataExtends<T>): IModelDecorator<T> {
    return createClassDecorator<ModelMetadata>('Model',
        args => {
            if (adapter) {
                adapter(args);
            }
            args.next<ModelMetadata>({
                match: (arg) => isString(arg),
                setMetadata: (metadata, arg) => {
                    metadata.table = arg;
                }
            });
        },
        metadata => {
            if (metaExtends) {
                metaExtends(metadata as T);
            }
            metadata.modelType = modelType;
            return metadata;
        }) as IModelDecorator<T>;
}

export const Model: IClassMethodDecorator<TypeMetadata> = createModelDecorator<TypeMetadata>();
