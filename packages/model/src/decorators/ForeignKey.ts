import { createFieldDecorator } from './Field';
import { ForeignKeyMetadata } from '../metadata';
import { isString, Type, isClass } from '@tsdi/ioc';


export interface IForeignKeyDecorator<T extends ForeignKeyMetadata> {
    (foreignKey?: string, refType?: Type, foreignOrder?: number, dbtype?: string, dbfield?: string): PropertyDecorator;
    /**
     * ForeignKey decorator with metadata map.
     * @param {T} [metadata] define matadata map to resolve value to the property.
     */
    (metadata?: T): PropertyDecorator;
    /**
     * ForeignKey decorator.
     */
    (target: object, propertyKey: string | symbol, descriptor?: TypedPropertyDescriptor<any>): void;

}

/**
 * ForeignKey decorator.
 */
export const ForeignKey: IForeignKeyDecorator<ForeignKeyMetadata> = createFieldDecorator<ForeignKeyMetadata>(
    'ForeignKey',
    [
        (ctx, next) => {
            let arg = ctx.currArg;
            if (isString(arg)) {
                ctx.metadata.foreignKey = arg;
                ctx.next(next);
            }
        },
        (ctx, next) => {
            let arg = ctx.currArg;
            if (isClass(arg)) {
                ctx.metadata.refType = arg;
                ctx.next(next);
            }
        }
    ]) as IForeignKeyDecorator<ForeignKeyMetadata>;

