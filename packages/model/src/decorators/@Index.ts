import { IFiledDecorator, createFieldDecorator } from './Field';
import { FieldMetadata } from '../metadata';


export const Index: IFiledDecorator<FieldMetadata> = createFieldDecorator<FieldMetadata>('Index');

