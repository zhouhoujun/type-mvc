import { Type, getPropertyMetadata, PropertyMetadata, isToken, IContainer, Inject, isClass, isUndefined, Singleton, ObjectMap, ContainerToken } from '@ts-ioc/core';
import { Field, Model } from './decorators';
import { IDbConfiguration, DbConfigurationToken } from './IDbConfiguration';

@Singleton
export class ModelParser {

    @Inject(ContainerToken)
    private container: IContainer;
    constructor(@Inject(DbConfigurationToken) private config: IDbConfiguration) {

    }

    isModel(type: Type<any>): boolean {
        return Reflect.hasOwnMetadata(Model.toString(), type);
    }

    parseModel(type: Type<any>, objMap: object) {
        let meta = this.getPropertyMeta(type);
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

    isBaseType(p): boolean {
        if (!isToken(p)) {
            return true;
        }

        if (p === Boolean || p === String || p === Number || p === Date) {
            return true;
        }

        return false;

    }

    protected getPropertyMeta(type: Type<any>): ObjectMap<PropertyMetadata[]> {
        let meta = getPropertyMetadata<PropertyMetadata>(Field, type);
        return meta;
    }
}
