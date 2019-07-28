import {
    Type, PropertyMetadata, isUndefined, Inject, isClass, ObjectMap,
    isBaseType, isArray, Abstract, SymbolType, Singleton, isNullOrUndefined, isFunction
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
        if (isArray(objMap)) {
            return objMap.map(o => this.parseModel(type, o));
        }

        let parser = this.container.get(BaseTypeParserToken);
        if (isBaseType(type)) {
            return parser.parse(type, objMap);
        }
        let meta = this.getPropertyMeta(type);
        let result = this.container.resolve({token: type, regify: true });
        for (let n in meta) {
            let propmetas = meta[n];
            if (propmetas.length) {
                if (!isUndefined(objMap[n])) {
                    let propmeta = propmetas.find(p => p && !!(p.provider || p.type));
                    if (!propmeta) {
                        continue;
                    }
                    let ptype = propmeta.provider ? this.container.getTokenProvider(propmeta.provider) : propmeta.type;
                    let reqval = objMap[n];
                    if (!isFunction(ptype) || isNullOrUndefined(reqval)) {
                        continue;
                    }
                    let parmVal;
                    if (this.isExtendBaseType(ptype)) {
                        parmVal = this.resolveExtendType(ptype, reqval);
                    } else if (isBaseType(ptype)) {
                        parmVal = parser.parse(ptype, reqval);
                    } else if (isClass(ptype)) {
                        parmVal = this.parseModel(ptype, reqval);
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
