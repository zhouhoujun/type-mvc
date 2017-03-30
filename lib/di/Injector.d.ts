import 'reflect-metadata';
import { Type } from '../type';
export declare const NOT_FOUND: Object;
/**
 * injector container.
 */
export declare abstract class Injector {
    static notFound: Object;
    static NULL: Injector;
    /**
     * Retrieves an instance from the injector based on the provided token.
     * If not found:
     * - Throws {@link NoProviderError} if no `notFoundValue` that is not equal to
     * Injector.THROW_IF_NOT_FOUND is given
     * - Returns the `notFoundValue` otherwise
     */
    abstract get<T>(token: Type<T> | InjectionToken<T>, notFoundValue?: T): T;
}
export declare class InjectionToken<T> {
    protected desc: string;
    constructor(desc: string);
    toString(): string;
}
