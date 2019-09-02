import { IFiledDecorator, createFieldDecorator } from './Field';
import { FieldMetadata } from '../metadata';

/**
 * Index decorator.
 */
export const Index: IFiledDecorator<FieldMetadata> = createFieldDecorator<FieldMetadata>('Index');

