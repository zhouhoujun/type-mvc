import { createFieldDecorator } from './Field';
import { MaxLengthMetadata } from '../metadata';
import { isNumber, isString } from '@tsdi/ioc';


export interface IMaxLengthDecorator<T extends MaxLengthMetadata> {
    /**
     * MaxLength decorator
     */
    (MaxLength?: number, errorMessage?: string, dbtype?: string, dbfield?: string): PropertyDecorator;
    /**
    * MaxLength decorator with metadata map.
    * @param {T} [metadata] define matadata map to resolve value to the property.
    */
   (metadata?: T): PropertyDecorator;
   /**
    * MaxLength decorator.
    */
   (target: object, propertyKey: string | symbol, descriptor?: TypedPropertyDescriptor<any>): void;

}

/**
 * MaxLength decorator.
 */
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

