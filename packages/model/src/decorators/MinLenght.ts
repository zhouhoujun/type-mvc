import { createFieldDecorator } from './Field';
import { MinLengthMetadata } from '../metadata';
import { isNumber, isString } from '@tsdi/ioc';


export interface IMinLengthDecorator<T extends MinLengthMetadata> {
    /**
     * MinLength decorator.
     */
    (MinLength?: number, errorMessage?: string, dbtype?: string, dbfield?: string): PropertyDecorator;
    /**
    * MinLength decorator with metadata map.
    * @param {T} [metadata] define matadata map to resolve value to the property.
    */
   (metadata?: T): PropertyDecorator;
   /**
    * MinLength decorator.
    */
   (target: object, propertyKey: string | symbol, descriptor?: TypedPropertyDescriptor<any>): void;
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

