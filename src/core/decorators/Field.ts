
import { IPropertyDecorator, PropertyMetadata, createPropDecorator } from '@ts-ioc/core';

export const Field: IPropertyDecorator<PropertyMetadata> = createPropDecorator<PropertyMetadata>('Field');
