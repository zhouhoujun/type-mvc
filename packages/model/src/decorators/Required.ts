import { createFieldDecorator } from './Field';
import { FieldMetadata } from '../metadata';
import { IPropertyDecorator } from '@tsdi/ioc';


export interface IRequiredDecorator<T extends FieldMetadata> extends IPropertyDecorator<T> {
    (dbtype?: string, dbfield?: string): PropertyDecorator;
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

