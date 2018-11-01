
import { IPropertyDecorator, PropertyMetadata, createPropDecorator, MetadataExtends, MetadataAdapter, isString, isNumber, isUndefined, isBoolean } from '@ts-ioc/core';
import { FieldMetadata } from '../metadata/index';


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
 * @param {MetadataAdapter} [adapter]
 * @param {MetadataExtends<T>} [metaExtends]
 * @returns {IFiledDecorator<T>}
 */
export function createFieldDecorator<T extends FieldMetadata>(
    decoratorName?: string,
    adapter?: MetadataAdapter,
    metaExtends?: MetadataExtends<T>): IFiledDecorator<T> {
    return createPropDecorator<FieldMetadata>('Field',
        args => {
            if (adapter) {
                adapter(args);
            }
            args.next<FieldMetadata>({
                match: (arg) => isString(arg),
                setMetadata: (metadata, arg) => {
                    metadata.dbtype = arg;
                }
            });

            args.next<FieldMetadata>({
                match: (arg) => isString(arg),
                setMetadata: (metadata, arg) => {
                    metadata.dbfield = arg;
                }
            });

            args.next<FieldMetadata>({
                match: (arg) => isUndefined(arg),
                setMetadata: (metadata, arg) => {
                    metadata.defaultValue = arg;
                }
            });

            args.next<FieldMetadata>({
                match: args => isBoolean(args),
                setMetadata: (metadata, arg) => {
                    metadata.required = arg;
                }
            });
        },
        metadata => {
            if (!metadata.dbfield) {
                metadata.dbfield = metadata.propertyKey.toString();
            }
            if (metaExtends) {
                metadata = metaExtends(metadata as T);
            }
            metadata.decorName = decoratorName;
            return metadata;
        }) as IFiledDecorator<T>;
}

export const Field: IFiledDecorator<FieldMetadata> = createFieldDecorator<FieldMetadata>();

