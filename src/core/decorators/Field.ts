
import { IPropertyDecorator, PropertyMetadata, createPropDecorator } from '@ts-ioc/core';

/**
 * Filed
 *
 * @Field
 */
export const Field: IPropertyDecorator<PropertyMetadata> = createPropDecorator<PropertyMetadata>('Field');
