
import { IPropertyDecorator, createPropDecorator, MetadataExtends, isString, isUndefined, isBoolean, ArgsIteratorAction } from '@tsdi/ioc';
import { FieldMetadata } from '../metadata';


/**
 * filed decorator type define.
 *
 * @export
 * @interface IFiledDecorator
 * @template T
 */
export interface IFiledDecorator<T extends FieldMetadata> extends IPropertyDecorator<T> {
    (dbtype?: string, dbfield?: string, defaultValue?: any, required?: boolean): PropertyDecorator;
}


/**
 * create filed decorator.
 *
 * @export
 * @template T
 * @param {string} [decoratorName]
 * @param {MetadataAdapter} [actions]
 * @param {MetadataExtends<T>} [metaExtends]
 * @returns {IFiledDecorator<T>}
 */
export function createFieldDecorator<T extends FieldMetadata>(
    decoratorName?: string,
    actions?: ArgsIteratorAction<T>[],
    metaExtends?: MetadataExtends<T>): IFiledDecorator<T> {
    return createPropDecorator<FieldMetadata>('Field',
        [
            ...(actions || []),
            (ctx, next) => {
                let arg = ctx.currArg;
                if (isString(arg)) {
                    ctx.metadata.dbtype = arg;
                    ctx.next(next);
                }
            },

            (ctx, next) => {
                let arg = ctx.currArg;
                if (isString(arg)) {
                    ctx.metadata.dbfield = arg;
                    ctx.next(next);
                }
            },

            (ctx, next) => {
                let arg = ctx.currArg;
                if (isUndefined(arg)) {
                    ctx.metadata.defaultValue = arg;
                    ctx.next(next);
                }
            },

            (ctx, next) => {
                let arg = ctx.currArg;
                if (isBoolean(arg)) {
                    ctx.metadata.required = arg;
                    ctx.next(next);
                }
            }
        ],
        metadata => {
            if (!metadata.dbfield) {
                metadata.dbfield = metadata.propertyKey.toString();
            }
            if (metaExtends) {
                metaExtends(metadata as T);
            }
            metadata.decorName = decoratorName;
            return metadata;
        }) as IFiledDecorator<T>;
}

export const Field: IFiledDecorator<FieldMetadata> = createFieldDecorator<FieldMetadata>();

