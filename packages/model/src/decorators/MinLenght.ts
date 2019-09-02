import { createFieldDecorator } from './Field';
import { MinLengthMetadata } from '../metadata';
import { IPropertyDecorator, isNumber, isString } from '@tsdi/ioc';


export interface IMinLengthDecorator<T extends MinLengthMetadata> extends IPropertyDecorator<T> {
    (MinLength?: number, errorMessage?: string, dbtype?: string, dbfield?: string): PropertyDecorator;
}

/**
 * MinLength decorator.
 */
export const MinLength: IMinLengthDecorator<MinLengthMetadata> = createFieldDecorator<MinLengthMetadata>(
    'MinLength',
    [
        (ctx, next) => {
            let arg = ctx.currArg;
            if (isNumber(arg)) {
                ctx.metadata.minLength = arg;
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
    ]
) as IMinLengthDecorator<MinLengthMetadata>;

