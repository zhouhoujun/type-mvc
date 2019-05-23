import { IFiledDecorator, createFieldDecorator } from './Field';
import { ForeignKeyMetadata } from '../metadata';
import { IPropertyDecorator, isNumber, isString, Type, isClass } from '@tsdi/ioc';


export interface IForeignKeyDecorator<T extends ForeignKeyMetadata> extends IPropertyDecorator<T> {
    (foreignKey?: string, refType?: Type<any>, foreignOrder?: number, dbtype?: string, dbfield?: string): PropertyDecorator;
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

