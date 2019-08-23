import {
    isString, TypeMetadata, IClassMethodDecorator, MetadataExtends, createClassDecorator, IClassDecorator, ArgsIteratorAction
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

export const Model: IClassMethodDecorator<TypeMetadata> = createModelDecorator<TypeMetadata>();
