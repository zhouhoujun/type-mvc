import 'reflect-metadata';
import { Type, Token } from '../util';


export const NOT_FOUND = new Object();

/**
 * injector container.
 */
export abstract class Injector {
    static notFound = NOT_FOUND;
    static NULL: Injector = new NullInjector();
    static instance: Injector = new DefaultInjector();

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
        return null;
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



class NullInjector implements Injector {
    get(token: any, notFoundValue: any = NOT_FOUND): any {
        if (notFoundValue === NOT_FOUND) {
            throw new Error(`No provider for ${JSON.stringify(token)}!`);
        }
        return notFoundValue;
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
