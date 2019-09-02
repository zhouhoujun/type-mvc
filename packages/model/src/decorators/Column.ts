import { IFiledDecorator, createFieldDecorator } from './Field';
import { FieldMetadata } from '../metadata';

/**
 * Column decorator.
 */
export const Column: IFiledDecorator<FieldMetadata> = createFieldDecorator<FieldMetadata>('Column');

