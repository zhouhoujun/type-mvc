import { IFiledDecorator, createFieldDecorator } from './Field';
import { FieldMetadata } from '../metadata/index';


export const Index: IFiledDecorator<FieldMetadata> = createFieldDecorator<FieldMetadata>('Index');

