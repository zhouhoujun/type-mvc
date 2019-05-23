import { IFiledDecorator, createFieldDecorator } from './Field';
import { MaxLengthMetadata } from '../metadata/index';
import { IPropertyDecorator, isNumber, isString } from '@tsdi/ioc';


export interface IMaxLengthDecorator<T extends MaxLengthMetadata> extends IPropertyDecorator<T> {
    (MaxLength?: number, errorMessage?: string, dbtype?: string, dbfield?: string): PropertyDecorator;
}

export const MaxLength: IMaxLengthDecorator<MaxLengthMetadata> = createFieldDecorator<MaxLengthMetadata>(
    'MaxLength',
    args => {
        args.next<MaxLengthMetadata>({
            match: (arg) => isNumber(arg),
            setMetadata: (metadata, arg) => {
                metadata.maxLength = arg;
            }
        });
        args.next<MaxLengthMetadata>({
            match: (arg) => isString(arg),
            setMetadata: (metadata, arg) => {
                metadata.errorMsg = arg;
            }
        });
    }
) as IMaxLengthDecorator<MaxLengthMetadata>;

