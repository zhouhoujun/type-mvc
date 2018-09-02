import { IFiledDecorator, createFieldDecorator } from './Field';
import { FieldMetadata } from '../metadata/index';


export const Column: IFiledDecorator<FieldMetadata> = createFieldDecorator<FieldMetadata>('Column');

