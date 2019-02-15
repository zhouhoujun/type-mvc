import {
    Type, getPropertyMetadata, PropertyMetadata, isUndefined, IContainer,
    Inject, isClass, ObjectMap, ContainerToken, Injectable, isBaseType, isArray, lang
} from '@ts-ioc/core';
import { Model, Field } from '../decorators';
import { ConfigurationToken, IConfiguration } from '../IConfiguration';
import { DefaultModelParserToken } from './IModelParser';
import { BaseTypeParserToken } from './IBaseTypeParser';

/**
 * modle parser.
 *
 * @export
 * @class ModelParser
 */
@Injectable(DefaultModelParserToken)
export class ModelParser {

    constructor(@Inject(ContainerToken) private container: IContainer, @Inject(ConfigurationToken) private config: IConfiguration) {
    }

    parseModel(type: Type<any>, objMap: any): any {
        if (isBaseType(type)) {
            let parser = this.container.get(BaseTypeParserToken)
            return parser.parse(type, objMap);
        }
        let meta = this.getPropertyMeta(type);
        let result = this.container.get(type);
        for (let n in meta) {
            let propmetas = meta[n];
            if (propmetas.length) {
                if (!isUndefined(objMap[n])) {
                    let propmeta = propmetas.find(p => !!p.type);
                    let reqval = objMap[n];
                    let parmVal;
                    if (isBaseType(propmeta.type)) {
                        let parser = this.container.get(BaseTypeParserToken)
                        parmVal = parser.parse(propmeta.type, reqval);
                    } else if (lang.isExtendsClass(propmeta.type, Array)) {
                        if (isArray(reqval)) {
                            parmVal = reqval.map(v => this.parseModel(lang.getClass(v), v));
                        } else {
                            parmVal = [];
                        }
                    } else if (isClass(propmeta.type)) {
                        parmVal = this.parseModel(propmeta.type, reqval);
                    }
                    result[n] = parmVal;
                }
            }
        }
        return result;
    }

    protected getModelDecorator(): string {
        return Model.toString();
    }

    protected getFiledDecorator(): string {
        return Field.toString();
    }

    protected getPropertyMeta(type: Type<any>): ObjectMap<PropertyMetadata[]> {
        return getPropertyMetadata<PropertyMetadata>(this.getFiledDecorator(), type);
    }

}
