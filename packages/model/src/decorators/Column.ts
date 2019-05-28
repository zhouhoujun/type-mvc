import { IFiledDecorator, createFieldDecorator } from './Field';
import { FieldMetadata } from '../metadata';


export const Column: IFiledDecorator<FieldMetadata> = createFieldDecorator<FieldMetadata>('Column');

