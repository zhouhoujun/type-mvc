import {
    Type, getPropertyMetadata, PropertyMetadata, ObjectMap, Injectable
} from '@tsdi/ioc';
import { DefaultModelParserToken, ModelParser } from '@tsdi/boot';
import { Field } from './decorators';

/**
 * modle parser.
 *
 * @export
 * @class ModelParser
 */
@Injectable(DefaultModelParserToken)
export class DefaultModelParser extends ModelParser {

    protected getFiledDecorator(): string {
        return Field.toString();
    }

    protected getPropertyMeta(type: Type): ObjectMap<PropertyMetadata[]> {
        return getPropertyMetadata<PropertyMetadata>(this.getFiledDecorator(), type);
    }

}
