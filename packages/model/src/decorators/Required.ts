import { createFieldDecorator } from './Field';
import { FieldMetadata } from '../metadata';


export interface IRequiredDecorator<T extends FieldMetadata> {
    /**
     * Required decorator
     */
    (dbtype?: string, dbfield?: string): PropertyDecorator;

    /**
     * Required decorator with metadata map.
     * @param {T} [metadata] define matadata map to resolve value to the property.
     */
    (metadata?: T): PropertyDecorator;
    /**
     * Required decorator.
     */
    (target: object, propertyKey: string | symbol, descriptor?: TypedPropertyDescriptor<any>): void;
}

/**
 * Required decorator.
 */
export const Required: IRequiredDecorator<FieldMetadata> = createFieldDecorator<FieldMetadata>(
    'Required',
    null,
    metadata => {
        metadata.required = true;
        return metadata;
    }
) as IRequiredDecorator<FieldMetadata>;

