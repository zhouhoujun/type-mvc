import { createFieldDecorator } from './Field';
import { ForeignKeyMetadata } from '../metadata';
import { IPropertyDecorator, isString, Type, isClass } from '@tsdi/ioc';


export interface IForeignKeyDecorator<T extends ForeignKeyMetadata> extends IPropertyDecorator<T> {
    (foreignKey?: string, refType?: Type, foreignOrder?: number, dbtype?: string, dbfield?: string): PropertyDecorator;
}

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

