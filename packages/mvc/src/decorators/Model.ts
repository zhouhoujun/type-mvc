import {
    isString, TypeMetadata, IClassMethodDecorator, MetadataAdapter,
    MetadataExtends, createClassDecorator, IClassDecorator
} from '@ts-ioc/core';
import { ModelMetadata } from '../metadata';


/**
 * model decorator type define.
 *
 * @export
 * @interface IModelDecorator
 * @template T
 */
export interface IModelDecorator<T extends ModelMetadata> extends IClassDecorator<T> {
    /**
     * model decorator. define class as model.
     * @param {string} dbtable db table name. the table stoage model.
     */
    (dbtable?: string): ClassDecorator;
}

/**
 * create model decorator.
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
                metadata = metaExtends(metadata as T);
            }
            metadata.modelType = modelType;
            return metadata;
        }) as IModelDecorator<T>;
}

/**
 * model decorator. define class as model.
 * @Model
 */
export const Model: IClassMethodDecorator<TypeMetadata> = createModelDecorator<TypeMetadata>();
