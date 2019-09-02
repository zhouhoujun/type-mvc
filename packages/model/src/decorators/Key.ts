import { IFiledDecorator, createFieldDecorator } from './Field';
import { FieldMetadata } from '../metadata';

/**
 * Key decorator.
 */
export const Key: IFiledDecorator<FieldMetadata> = createFieldDecorator<FieldMetadata>('Key');

