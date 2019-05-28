import { IFiledDecorator, createFieldDecorator } from './Field';
import { FieldMetadata } from '../metadata';


export const Key: IFiledDecorator<FieldMetadata> = createFieldDecorator<FieldMetadata>('Key');

