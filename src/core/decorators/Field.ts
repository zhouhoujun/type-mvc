
import { IPropertyDecorator, PropertyMetadata, createPropDecorator } from 'tsioc';

export const Field: IPropertyDecorator<PropertyMetadata> = createPropDecorator<PropertyMetadata>('Field');
