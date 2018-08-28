import { Type, getPropertyMetadata, PropertyMetadata, isToken, isUndefined, IContainer, Inject, isClass, Singleton, ObjectMap, ContainerToken, SymbolType, hasClassMetadata, hasOwnClassMetadata, Injectable } from '@ts-ioc/core';
import { Model, Field } from '../decorators';
import { ConfigurationToken, IConfiguration } from '../IConfiguration';
import { ModelParserToken } from './IModelParser';

@Injectable(ModelParserToken)
export class ModelParser {

    constructor(@Inject(ContainerToken) private container: IContainer, @Inject(ConfigurationToken) private config: IConfiguration) {
    }

    isModel(type: Type<any>): boolean {
        return hasOwnClassMetadata(this.getModelDecorator(), type);
    }

    parseModel(type: Type<any>, objMap: any): any {
        let meta = this.getPropertyMeta(type);
        if (!this.container.has(type) && isClass(type)) {
            this.container.register(type);
        }
        let result = this.container.get(type);
        for (let n in meta) {
            let propmetas = meta[n];
            if (propmetas.length) {
                if (!isUndefined(objMap[n])) {
                    let propmeta = propmetas.find(p => !!p.type);
                    let reqval = objMap[n];
                    let parmVal;
                    if (this.isBaseType(propmeta.type)) {
                        parmVal = this.parseBaseType(propmeta.type, reqval);
                    } else if (isClass(propmeta.type) && this.isModel(propmeta.type)) {
                        parmVal = this.parseModel(propmeta.type, reqval);
                    }
                    result[n] = parmVal;
                }
            }
        }
        return result;
    }

    parseBaseType(type, paramVal): any {
        let val;
        if (type === String) {
            val = String(paramVal);
        } else if (type === Boolean) {
            val = new Boolean(paramVal);
        } else if (type === Number) {
            val = parseFloat(paramVal);
        } else if (type === Date) {
            val = new Date(paramVal);
        } else {
            val = paramVal;
        }
        return val;
    }

    isBaseType(p: any): boolean {
        if (!isToken(p)) {
            return true;
        }
        if (p === Boolean || p === String || p === Number || p === Date) {
            return true;
        }
        return false;
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
