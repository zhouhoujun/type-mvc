import {
    Type, getPropertyMetadata, PropertyMetadata, ObjectMap, Injectable
} from '@tsdi/ioc';
import { Field } from './decorators';
import { DefaultModelParserToken, ModelParser } from '@mvx/mvc';

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

    protected getPropertyMeta(type: Type<any>): ObjectMap<PropertyMetadata[]> {
        return getPropertyMetadata<PropertyMetadata>(this.getFiledDecorator(), type);
    }

}
