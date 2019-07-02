import { createFieldDecorator } from './Field';
import { ForeignKeyMetadata } from '../metadata';
import { IPropertyDecorator, isString, Type, isClass } from '@tsdi/ioc';


export interface IForeignKeyDecorator<T extends ForeignKeyMetadata> extends IPropertyDecorator<T> {
    (foreignKey?: string, refType?: Type, foreignOrder?: number, dbtype?: string, dbfield?: string): PropertyDecorator;
}

export const ForeignKey: IForeignKeyDecorator<ForeignKeyMetadata> = createFieldDecorator<ForeignKeyMetadata>(
    'ForeignKey',
    args => {
        args.next<ForeignKeyMetadata>({
            match: (arg) => isString(arg),
            setMetadata: (metadata, arg) => {
                metadata.foreignKey = arg;
            }
        });
        args.next<ForeignKeyMetadata>({
            match: (arg) => isClass(arg),
            setMetadata: (metadata, arg) => {
                metadata.refType = arg;
            }
        });
    }
) as IForeignKeyDecorator<ForeignKeyMetadata>;

