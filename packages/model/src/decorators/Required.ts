import { createFieldDecorator } from './Field';
import { FieldMetadata } from '../metadata/index';
import { IPropertyDecorator } from '@tsdi/core';


export interface IRequiredDecorator<T extends FieldMetadata> extends IPropertyDecorator<T> {
    (dbtype?: string, dbfield?: string): PropertyDecorator;
}

export const Required: IRequiredDecorator<FieldMetadata> = createFieldDecorator<FieldMetadata>(
    'Required',
    null,
    metadata => {
        metadata.required = true;
        return metadata;
    }
) as IRequiredDecorator<FieldMetadata>;

