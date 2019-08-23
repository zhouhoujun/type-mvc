import { IFiledDecorator, createFieldDecorator } from './Field';
import { MaxLengthMetadata } from '../metadata';
import { IPropertyDecorator, isNumber, isString } from '@tsdi/ioc';


export interface IMaxLengthDecorator<T extends MaxLengthMetadata> extends IPropertyDecorator<T> {
    (MaxLength?: number, errorMessage?: string, dbtype?: string, dbfield?: string): PropertyDecorator;
}

export const MaxLength: IMaxLengthDecorator<MaxLengthMetadata> = createFieldDecorator<MaxLengthMetadata>(
    'MaxLength',
    [
        (ctx, next) => {
            let arg = ctx.currArg;
            if (isNumber(arg)) {
                ctx.metadata.maxLength = arg;
                ctx.next(next);
            }
        },
        (ctx, next) => {
            let arg = ctx.currArg;
            if (isString(arg)) {
                ctx.metadata.errorMsg = arg;
                ctx.next(next);
            }
        }
    ]) as IMaxLengthDecorator<MaxLengthMetadata>;

