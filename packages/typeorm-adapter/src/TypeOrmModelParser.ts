import { ModelParser, DefaultModelParserToken, DBPropertyMetadata } from '@mvx/mvc';
import { Singleton, Type, ObjectMap, Autorun, SymbolType, Token, isFunction, isString } from '@tsdi/ioc';
import { getMetadataArgsStorage } from 'typeorm';
import { ColumnMetadataArgs } from 'typeorm/metadata-args/ColumnMetadataArgs';
import { ObjectID } from 'mongodb';

@Singleton(DefaultModelParserToken)
@Autorun('setup')
export class TypeOrmModelParser extends ModelParser {

    constructor() {
        super()
    }

    setup() {
        this.getTypeMap()
            .register(ObjectID, (id) => new ObjectID(id));
    }

    protected getPropertyMeta(type: Type): ObjectMap<DBPropertyMetadata[]> {
        let metas = {};
        getMetadataArgsStorage().columns.filter(col => col.target === type)
            .forEach(col => {
                metas[col.propertyName] = metas[col.propertyName] || [];
                metas[col.propertyName].push(<DBPropertyMetadata>{
                    propertyKey: col.propertyName,
                    dbtype: isString(col.options.type) ? col.options.type : '',
                    type: this.getModeType(col)
                });
            });

        getMetadataArgsStorage().relations.filter(col => col.target === type)
            .forEach(col => {
                metas[col.propertyName] = metas[col.propertyName] || [];
                let relaModel = isFunction(col.type) ? col.type() as Token : undefined;
                metas[col.propertyName].push(<DBPropertyMetadata>{
                    propertyKey: col.propertyName,
                    provider: relaModel,
                    type: (col.relationType === 'one-to-many' || col.relationType === 'many-to-many') ? Array : relaModel
                });
            });
        return metas;
    }

    protected isExtendBaseType(type: SymbolType, propmeta?: DBPropertyMetadata): boolean {
        if (propmeta.dbtype) {
            if (/int/.test(propmeta.dbtype)) {
                return true;
            }
        }
        if (type === ObjectID) {
            return true;
        }
        return super.isExtendBaseType(type, propmeta);
    }

    protected resolveExtendType(type: SymbolType, value: any, propmeta?: DBPropertyMetadata): any {
        if (propmeta.dbtype) {
            if (/int/.test(propmeta.dbtype)) {
                return parseInt(value);
            }
        }
        if (type === ObjectID) {
            return new ObjectID(value);
        }
        return super.resolveExtendType(type, propmeta);
    }



    protected getModeType(col: ColumnMetadataArgs) {
        let type: SymbolType = col.options.type;
        if (type) {
            if (isString(type)) {
                if (type === 'uuid') {
                    return String;
                } else if (/(int|float|double|dec|numeric|number)/.test(type)) {
                    return Number;
                } else if (/(bool|bit)/.test(type)) {
                    return Boolean;
                } else if (/(char|var|string|text)/.test(type)) {
                    return String;
                } else if (/(time|date)/.test(type)) {
                    return Date;
                } else if (/array/.test(type)) {
                    return Array;
                } else if (/(bytes|bytea)/.test(type)) {
                    return Buffer
                } else {
                    return Object;
                }
            }
            return type;
        }
        switch (col.mode) {
            case 'objectId':
                type = ObjectID;
                break;
        }
        return type;
    }

}
