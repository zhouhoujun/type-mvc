import 'reflect-metadata';
import { stringify, Type } from '../util';


export function makeMethodDecorator(
    name: string, props: ([string, any] | { [key: string]: any })[], parentClass?: any): (...args: any[]) => MethodDecorator {

    const metaCtor = makeMetadataCtor(props);
    function MethodDecoratorFactory(...args: any[]): MethodDecorator {
        if (this instanceof MethodDecoratorFactory) {
            metaCtor.apply(this, args);
            return this;
        }

        const decoratorInstance = new (<any>MethodDecoratorFactory)(...args);

        return function MethDecorator<T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void {
            const meta = Reflect.getOwnMetadata('methMetadata', target.constructor) || {};
            meta[propertyKey] = meta.hasOwnProperty(propertyKey) && meta[propertyKey] || [];
            meta[propertyKey].unshift(decoratorInstance);
            Reflect.defineMetadata('methMetadata', meta, target.constructor);
        };
    }

    if (parentClass) {
        MethodDecoratorFactory.prototype = Object.create(parentClass.prototype);
    }

    MethodDecoratorFactory.prototype.toString = () => `@${name}`;
    (<any>MethodDecoratorFactory).annotationCls = MethodDecoratorFactory;
    return MethodDecoratorFactory;

}


export function makeParamDecorator<T>(
    name: string, props: ([string, any] | { [name: string]: any })[], parentClass?: any): (...args: any[]) => ParameterDecorator {
    const metaCtor = makeMetadataCtor(props);
    function ParamDecoratorFactory(...args: any[]): ParameterDecorator {
        if (this instanceof ParamDecoratorFactory) {
            metaCtor.apply(this, args);
            return this;
        }
        const annotationInstance = new (<any>ParamDecoratorFactory)(...args);

        (<any>ParamDecorator).annotation = annotationInstance;
        return ParamDecorator;

        function ParamDecorator(cls: any, propertyKey: string | symbol, index: number) {
            const parameters: any[][] = Reflect.getOwnMetadata('parameters', cls) || [];

            // there might be gaps if some in between parameters do not have annotations.
            // we pad with nulls.
            while (parameters.length <= index) {
                parameters.push(null);
            }

            parameters[index] = parameters[index] || [];
            parameters[index].push(annotationInstance);

            Reflect.defineMetadata('parameters', parameters, cls);
            return cls;
        }
    }
    if (parentClass) {
        ParamDecoratorFactory.prototype = Object.create(parentClass.prototype);
    }
    ParamDecoratorFactory.prototype.toString = () => `@${name}`;
    (<any>ParamDecoratorFactory).annotationCls = ParamDecoratorFactory;
    return ParamDecoratorFactory;
}


function extractAnnotation(annotation: any): any {
    if (typeof annotation === 'function' && annotation.hasOwnProperty('annotation')) {
        // it is a decorator, extract annotation
        annotation = annotation.annotation;
    }
    return annotation;
}

function applyParams(fnOrArray: (Function | any[]), key: string): Function {
    if (fnOrArray === Object || fnOrArray === String || fnOrArray === Function ||
        fnOrArray === Number || fnOrArray === Array) {
        throw new Error(`Can not use native ${stringify(fnOrArray)} as constructor`);
    }

    if (typeof fnOrArray === 'function') {
        return fnOrArray;
    }

    if (Array.isArray(fnOrArray)) {
        const annotations: any[] = fnOrArray;
        const annoLength = annotations.length - 1;
        const fn: Function = fnOrArray[annoLength];
        if (typeof fn !== 'function') {
            throw new Error(
                `Last position of Class method array must be Function in key ${key} was '${stringify(fn)}'`);
        }
        if (annoLength !== fn.length) {
            throw new Error(
                `Number of annotations (${annoLength}) does not match number of arguments (${fn.length}) in the function: ${stringify(fn)}`);
        }
        const paramsAnnotations: any[][] = [];
        for (let i = 0, ii = annotations.length - 1; i < ii; i++) {
            const paramAnnotations: any[] = [];
            paramsAnnotations.push(paramAnnotations);
            const annotation = annotations[i];
            if (Array.isArray(annotation)) {
                for (let j = 0; j < annotation.length; j++) {
                    paramAnnotations.push(extractAnnotation(annotation[j]));
                }
            } else if (typeof annotation === 'function') {
                paramAnnotations.push(extractAnnotation(annotation));
            } else {
                paramAnnotations.push(annotation);
            }
        }
        Reflect.defineMetadata('parameters', paramsAnnotations, fn);
        return fn;
    }

    throw new Error(`Only Function or Array is supported in Class definition for key '${key}' is '${stringify(fnOrArray)}'`);
}

function makeMetadataCtor(props: ([string, any] | { [key: string]: any })[]): any {
    return function ctor(...args: any[]) {
        props.forEach((prop, i) => {
            const argVal = args[i];
            if (Array.isArray(prop)) {
                // plain parameter
                this[prop[0]] = argVal === undefined ? prop[1] : argVal;
            } else {
                for (const propName in prop) {
                    this[propName] =
                        argVal && argVal.hasOwnProperty(propName) ? argVal[propName] : prop[propName];
                }
            }
        });
    };
}
