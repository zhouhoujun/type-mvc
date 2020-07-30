import {
    isString, TypeMetadata, MetadataExtends, createClassDecorator, ArgsIteratorAction, Type
} from '@tsdi/ioc';
import { ModelMetadata } from '../metadata';


/**
 * model decorator type define.
 *
 * @export
 * @interface IModelDecorator
 * @template T
 */
export interface IModelDecorator<T extends ModelMetadata> {
    (dbtable?: string): ClassDecorator;

    /**
     * model decorator setting with metadata map.
     *
     * @param {T} [metadata] metadata map.
     */
    (metadata?: T): ClassDecorator;
    /**
     * model with out metadata.
     */
    (target: Type): void;
}

/**
 * create filed decorator.
 *
 * @export
 * @template T
 * @param {string} [modelType]
 * @param {ArgsIteratorAction<T>[]} [actions]
 * @param {MetadataExtends<T>} [metaExtends]
 * @returns {IFiledDecorator<T>}
 */
export function createModelDecorator<T extends ModelMetadata>(
    modelType?: string,
    actions?: ArgsIteratorAction<T>[],
    metaExtends?: MetadataExtends<T>): IModelDecorator<T> {
    return createClassDecorator<ModelMetadata>('Model',
        [
            ...(actions || []),
            (ctx, next) => {
                let arg = ctx.currArg;
                if (isString(arg)) {
                    ctx.metadata.table = arg;
                    ctx.next(next);
                }
            },
        ],
        metadata => {
            if (metaExtends) {
                metaExtends(metadata as T);
            }
            metadata.modelType = modelType;
            return metadata;
        }) as IModelDecorator<T>;
}

export const Model: IModelDecorator<TypeMetadata> = createModelDecorator<TypeMetadata>();
