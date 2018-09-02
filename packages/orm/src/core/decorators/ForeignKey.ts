import { IFiledDecorator, createFieldDecorator } from './Field';
import { ForeignKeyMetadata } from '../metadata';
import { IPropertyDecorator, isNumber, isString } from '@ts-ioc/core';


export interface IForeignKeyDecorator<T extends ForeignKeyMetadata> extends IPropertyDecorator<T> {
    (foreignKey?: string, foreignOrder?: number, dbtype?: string, dbfield?: string): PropertyDecorator;
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
    }
) as IForeignKeyDecorator<ForeignKeyMetadata>;

