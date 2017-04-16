import 'reflect-metadata';
import { Token } from '../util';


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
