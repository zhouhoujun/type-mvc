import 'reflect-metadata';
import { Token, Type, InjectionToken } from '../util';
import { Output, Input, Injectable } from '../decorators';

export const NOT_FOUND = new Object();

/**
 * injector container.
 */
export abstract class Injector {
    static notFound = NOT_FOUND;
    static get Null(): Injector {
        return Null;
    }
    static get instance(): Injector {
        return Default;
    }

    /**
     * Retrieves an instance from the injector based on the provided token.
     *
     * @abstract
     * @template T
     * @param {Token<T>} [token]
     * @param {T} [notFoundValue]
     * @returns {T}
     *
     * @memberOf Injector
     */
    abstract get<T>(token?: Token<T>, notFoundValue?: T): T;

    /**
     * register type.
     * @abstract
     * @template T
     * @param {Token<T>} token
     * @param {T} [notFoundValue]
     * @memberOf Injector
     */
    abstract register<T>(token: Token<T>, notFoundValue?: T);

    /**
     * register stingleton type.
     * @abstract
     * @template T
     * @param {Token<T>} token
     * @param {T} value
     *
     * @memberOf Injector
     */
    abstract registerSingleton<T>(token: Token<T>, value: T);
}

/**
 * default Injector.
 * @export
 * @class DefaultInjector
 * @extends {Injector}
 */
export class DefaultInjector extends Injector {
    private factories: Map<Token<any>, any>;
    private singleton: Map<Token<any>, any>;
    constructor() {
        super();
        this.factories = new Map<Token<any>, any>();
    }

    /**
     * get instance via token.
     * @template T
     * @param {Token<T>} [token]
     * @param {T} [notFoundValue]
     * @returns {T}
     *
     * @memberOf DefaultInjector
     */
    get<T>(token?: Token<T>, notFoundValue?: T): T {
        if (!this.factories.has(token)) {
            return notFoundValue === undefined ? (NOT_FOUND as T) : notFoundValue;
        }
        let factory = this.factories.get(token);
        return factory() as T;
    }

    /**
     * register type.
     * @abstract
     * @template T
     * @param {Token<T>} token
     * @param {T} [value]
     * @memberOf Injector
     */
    register<T>(token: Token<T>, value?: T) {
        this.registerFactory(token, value);
    }

    /**
     * register stingleton type.
     * @abstract
     * @template T
     * @param {Token<T>} token
     * @param {T} [value]
     *
     * @memberOf Injector
     */
    registerSingleton<T>(token: Token<T>, value?: T) {
        this.registerFactory(token, value, true);
    }

    protected getTokenKey<T>(token: Token<T>) {
        return (token instanceof InjectionToken) ? token.toString() : token;
    }

    protected registerFactory<T>(token: Token<T>, value?: T, singleton?: boolean) {
        let key = this.getTokenKey(token);
        if (this.factories.has(token)) {
            return;
        }

        let classFactory;
        if (singleton && value !== undefined) {
            let symbolValue = value;
            classFactory = () => {
                return symbolValue;
            }
        } else if (typeof token !== 'string' && typeof token !== 'symbol') {
            let ClassT = (token instanceof InjectionToken) ? token.getClass() : token as Type<T>
            let parameters = this.getParameterMetadata(ClassT);
            this.registerDependencies(...parameters);
            let props = this.getInputMetadata(ClassT);
            this.registerDependencies(...props);

            classFactory = () => {
                if (singleton && this.singleton.has(token)) {
                    return this.singleton.get(token);
                }

                let paramInstances = parameters.map((ParamClass, index) => this.get(ParamClass));
                let instance = new ClassT(...paramInstances);
                if (instance) {
                    props.forEach((prop, idx) => {
                            instance[prop.bindingPropertyName] = this.get(PropClass);
                        });
                } else {
                    instance = value;
                }
                if (singleton) {
                    this.singleton.set(key, instance);
                }
                return instance;
            };
        } else {
            let symbolValue = value;
            classFactory = () => {
                return symbolValue;
            }
        }

        this.factories.set(key, classFactory);
    }

    protected getParameterMetadata<T>(type: Type<T>): Injectable[] {
        let parameters: Injectable[] = Reflect.getMetadata('parameters', type) || [];
        return parameters;
    }

    protected getInputMetadata<T>(type: Type<T>): Input[] {
        let parameters: Input[] = Reflect.getMetadata('Input', type) || [];
        return parameters;
    }

    protected getOuputMetadata<T>(type: Type<T>): Output[] {
        let parameters: Output[] = Reflect.getMetadata('Output', type) || [];
        return parameters;
    }

    protected registerDependencies<T>(...deps: Token<any>[]) {
        deps.forEach(Deptype => {
            let injectableConfig = Reflect.getMetadata('Injectable', Deptype);
            if (injectableConfig) {
                this.register(Deptype, injectableConfig);
            }
        });
    }
}

/**
 * Null Injector.
 */
class NullInjector extends Injector {
    constructor() {
        super();
    }
    get<T>(token: T, notFoundValue = NOT_FOUND): T {
        if (notFoundValue === NOT_FOUND) {
            throw new Error(`No provider for ${JSON.stringify(token)}!`);
        }
        return notFoundValue as T;
    }

    /**
     * register type.
     * @abstract
     * @template T
     * @param {Token<T>} token
     * @param {T} [notFoundValue]
     * @memberOf Injector
     */
    register<T>(token: Token<T>, notFoundValue?: T) {

    }

    /**
     * register stingleton type.
     * @abstract
     * @template T
     * @param {Token<T>} token
     * @param {T} value
     *
     * @memberOf Injector
     */
    registerSingleton<T>(token: Token<T>, value: T) {

    }
}

const Default = new DefaultInjector();
const Null = new NullInjector();
