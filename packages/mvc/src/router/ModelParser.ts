import {
    Type, PropertyMetadata, isUndefined,
    Inject, isClass, ObjectMap, isBaseType, isArray, lang, Abstract
} from '@tsdi/ioc';
import { IModelParser } from './IModelParser';
import { ContainerToken, IContainer } from '@tsdi/core';
import { BaseTypeParserToken } from '@tsdi/boot';

/**
 * modle parser.
 *
 * @export
 * @class ModelParser
 */
@Abstract()
export abstract class ModelParser implements IModelParser {

    constructor(@Inject(ContainerToken) private container: IContainer) {
    }

    parseModel(type: Type, objMap: any): any {
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
                    if (isBaseType(lang.getClass(propmeta.type))) {
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

    protected abstract getPropertyMeta(type: Type): ObjectMap<PropertyMetadata[]>;

}
