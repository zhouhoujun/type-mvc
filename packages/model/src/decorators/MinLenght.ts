import { createFieldDecorator } from './Field';
import { MinLengthMetadata } from '../metadata/index';
import { IPropertyDecorator, isNumber, isString } from '@tsdi/ioc';


export interface IMinLengthDecorator<T extends MinLengthMetadata> extends IPropertyDecorator<T> {
    (MinLength?: number, errorMessage?: string, dbtype?: string, dbfield?: string): PropertyDecorator;
}

export const MinLength: IMinLengthDecorator<MinLengthMetadata> = createFieldDecorator<MinLengthMetadata>(
    'MinLength',
    args => {
        args.next<MinLengthMetadata>({
            match: (arg) => isNumber(arg),
            setMetadata: (metadata, arg) => {
                metadata.minLength = arg;
            }
        });
        args.next<MinLengthMetadata>({
            match: (arg) => isString(arg),
            setMetadata: (metadata, arg) => {
                metadata.errorMsg = arg;
            }
        });
    }
) as IMinLengthDecorator<MinLengthMetadata>;

