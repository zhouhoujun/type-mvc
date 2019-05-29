import { ModelParser, DefaultModelParserToken } from '@mvx/mvc';
import { Singleton, Type, ObjectMap, PropertyMetadata, Refs } from '@tsdi/ioc';
import { getMetadataArgsStorage, EntityMetadata } from 'typeorm';


@Singleton(DefaultModelParserToken)
export class TypeOrmModelParser extends ModelParser {

    protected getPropertyMeta(type: Type<any>): ObjectMap<PropertyMetadata[]> {
        let metas = {};
        getMetadataArgsStorage().columns.filter(col => col.target === type)
            .forEach(col => {
                metas[col.propertyName] = metas[col.propertyName] || [];
                metas[col.propertyName].push(<PropertyMetadata>{
                    propertyKey: col.propertyName,
                    type: col.options.type
                });
            })
        return metas;
    }

}
