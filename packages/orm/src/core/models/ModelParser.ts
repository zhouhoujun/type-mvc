import { Type, getPropertyMetadata, PropertyMetadata, isUndefined, IContainer, Inject, isClass, ObjectMap, ContainerToken, hasOwnClassMetadata, Injectable, isBaseType, isArray } from '@ts-ioc/core';
import { Model, Field } from '../decorators';
import { ConfigurationToken, IConfiguration, BaseTypeParserToken, DefaultModelParserToken } from '@mvx/mvc';
import { FieldMetadata } from '../metadata';

@Injectable(DefaultModelParserToken)
export class ModelParser {

    constructor(@Inject(ContainerToken) private container: IContainer, @Inject(ConfigurationToken) private config: IConfiguration) {
    }

    parseModel(type: Type<any>, objMap: any): any {
        let meta = this.getFieldMetadata(type);
        let result = this.container.get(type);
        for (let n in meta) {
            let fieldmetas = meta[n];
            if (fieldmetas.length) {
                if (!isUndefined(objMap[n])) {
                    let fieldmeta = fieldmetas.find(p => !!p.type);
                    let reqval = objMap[n];
                    let parmVal;
                    if (isBaseType(fieldmeta.type)) {
                        let parser = this.container.get(BaseTypeParserToken)
                        parmVal = parser.parse(fieldmeta.type, reqval);
                    } else if (fieldmeta.type === Array) {
                        let refType = fieldmeta.refType;
                        if (!refType) {
                            let refmeta = fieldmetas.find(p => !!p.refType);
                            if (refmeta) {
                                refType = refmeta.refType;
                            }
                        }
                        if (isArray(reqval)) {
                            parmVal = reqval.map(val => this.parseModel(fieldmeta.refType, val));
                        } else {
                            parmVal = [this.parseModel(fieldmeta.refType, reqval)];
                        }
                    } else if (isClass(fieldmeta.type)) {
                        parmVal = this.parseModel(fieldmeta.type, reqval);
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

    protected getFieldMetadata(type: Type<any>): ObjectMap<FieldMetadata[]> {
        return getPropertyMetadata<FieldMetadata>(this.getFiledDecorator(), type);
    }

}
