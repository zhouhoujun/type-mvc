import { ModelParser, DefaultModelParserToken } from '@mvx/mvc';
import { Singleton, Type, ObjectMap, PropertyMetadata, Autorun, SymbolType, Token, isFunction } from '@tsdi/ioc';
import { getMetadataArgsStorage } from 'typeorm';
import { ColumnMetadataArgs } from 'typeorm/metadata-args/ColumnMetadataArgs';
import { ObjectID } from 'mongodb';
import { isString } from 'util';

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

    protected getPropertyMeta(type: Type): ObjectMap<PropertyMetadata[]> {
        let metas = {};
        getMetadataArgsStorage().columns.filter(col => col.target === type)
            .forEach(col => {
                metas[col.propertyName] = metas[col.propertyName] || [];
                metas[col.propertyName].push(<PropertyMetadata>{
                    propertyKey: col.propertyName,
                    type: this.getModeType(col)
                });
            });

        getMetadataArgsStorage().relations.filter(col => col.target === type)
            .forEach(col => {
                metas[col.propertyName] = metas[col.propertyName] || [];
                let relaModel = isFunction(col.type) ? col.type() as Token : undefined;
                metas[col.propertyName].push(<PropertyMetadata>{
                    propertyKey: col.propertyName,
                    provider: relaModel,
                    type: (col.relationType === 'one-to-many' || col.relationType === 'many-to-many') ? Array : relaModel
                });
            });
        return metas;
    }

    protected getModeType(col: ColumnMetadataArgs) {
        let type: SymbolType = col.options.type;
        if (type) {
            if (isString(type)) {
                if (type === 'uuid') {
                    return String;
                } else if (/(int|float|double|dec)/.test(type)) {
                    return Number;
                } else if (/bool/.test(type)) {
                    return Boolean;
                } else if (/(var|string|text)/.test(type)) {
                    return String;
                } else if (/time/.test(type)) {
                    return Date;
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
