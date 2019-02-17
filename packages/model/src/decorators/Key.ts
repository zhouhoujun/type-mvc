import { IFiledDecorator, createFieldDecorator } from './Field';
import { FieldMetadata } from '../metadata/index';


export const Key: IFiledDecorator<FieldMetadata> = createFieldDecorator<FieldMetadata>('Key');

