import {
    Type, PropertyMetadata, isUndefined, Inject, isClass, ObjectMap,
    isBaseType, isArray, lang, Abstract, SymbolType, Singleton, isNullOrUndefined
} from '@tsdi/ioc';
import { IModelParser } from './IModelParser';
import { ContainerToken, IContainer } from '@tsdi/core';
import { BaseTypeParserToken } from '@tsdi/boot';


@Singleton
export class ExtendBaseTypeMap {
    protected maps: Map<SymbolType<any>, (...params: any[]) => any>;
    constructor() {
        this.maps = new Map();
    }

    has(type: SymbolType): boolean {
        return this.maps.has(type);
    }

    register<T>(type: SymbolType<T>, factory: (...params: any[]) => T) {
        this.maps.set(type, factory);
    }

    resolve<T>(type: SymbolType<T>, ...params: any[]): T {
        if (this.maps.has(type)) {
            return this.maps.get(type)(...params);
        }
        return null;
    }
}


/**
 * modle parser.
 *
 * @export
 * @class ModelParser
 */
@Abstract()
export abstract class ModelParser implements IModelParser {

    @Inject(ContainerToken)
    protected container: IContainer;

    constructor() {
    }



    parseModel(type: Type, objMap: any): any {
        let parser = this.container.get(BaseTypeParserToken);
        if (isArray(objMap)) {
            return objMap.map(o => this.parseModel(type, o));
        }
        if (isBaseType(type)) {
            return parser.parse(type, objMap);
        }
        let meta = this.getPropertyMeta(type);
        let result = this.container.get(type);
        for (let n in meta) {
            let propmetas = meta[n];
            if (propmetas.length) {
                if (!isUndefined(objMap[n])) {
                    let propmeta = propmetas.find(p => p && (!!p.type));
                    if (!propmeta) {
                        continue;
                    }
                    let reqval = objMap[n];
                    if (isNullOrUndefined(reqval)) {
                        continue;
                    }
                    let parmVal;
                    if (this.isExtendBaseType(propmeta.type)) {
                        parmVal = this.resolveExtendType(propmeta.type, reqval);
                    } else if (lang.isExtendsClass(propmeta.type, Array)) {
                        if (isArray(reqval)) {
                            parmVal = reqval.map(v => this.parseModel(lang.getClass(v), v));
                        } else {
                            parmVal = [];
                        }
                    } else if (isBaseType(lang.getClass(propmeta.type))) {
                        parmVal = parser.parse(propmeta.type, reqval);
                    } else if (isClass(propmeta.type)) {
                        parmVal = this.parseModel(propmeta.type, reqval);
                    }
                    result[n] = parmVal;
                }
            }
        }
        return result;
    }

    private typeMap: ExtendBaseTypeMap;
    getTypeMap(): ExtendBaseTypeMap {
        if (!this.typeMap) {
            this.typeMap = this.container.get(ExtendBaseTypeMap);
        }
        return this.typeMap;
    }

    protected isExtendBaseType(type: SymbolType): boolean {
        return this.getTypeMap().has(type);
    }

    protected resolveExtendType(type: SymbolType, ...values: any[]): any {
        return this.getTypeMap().resolve(type, ...values);
    }

    protected abstract getPropertyMeta(type: Type): ObjectMap<PropertyMetadata[]>;

}
