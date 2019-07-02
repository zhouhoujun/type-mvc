import { ModelParser, DefaultModelParserToken } from '@mvx/mvc';
import { Singleton, Type, ObjectMap, PropertyMetadata } from '@tsdi/ioc';
import { getMetadataArgsStorage } from 'typeorm';


@Singleton(DefaultModelParserToken)
export class TypeOrmModelParser extends ModelParser {

    protected getPropertyMeta(type: Type): ObjectMap<PropertyMetadata[]> {
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
