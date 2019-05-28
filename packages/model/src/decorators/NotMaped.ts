import { IFiledDecorator, createFieldDecorator } from './Field';
import { FieldMetadata } from '../metadata';


export const NotMaped: IFiledDecorator<FieldMetadata> = createFieldDecorator<FieldMetadata>(
    'NotMaped',
    null,
    metadata => {
        metadata.dbtype = '';
        return metadata;
    }
) as IFiledDecorator<FieldMetadata>;

