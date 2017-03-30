import 'reflect-metadata';
import { Type } from '../util/type';


export const NOT_FOUND = new Object();

/**
 * injector container.
 */
export abstract class Injector {
    static notFound = NOT_FOUND;
    static NULL: Injector = new NullInjector();

    /**
     * Retrieves an instance from the injector based on the provided token.
     * If not found:
     * - Throws {@link NoProviderError} if no `notFoundValue` that is not equal to
     * Injector.THROW_IF_NOT_FOUND is given
     * - Returns the `notFoundValue` otherwise
     */
    abstract get<T>(token: Type<T> | InjectionToken<T>, notFoundValue?: T): T;
}


export class InjectionToken<T> {
    constructor(protected desc: string) {
    }

    toString(): string {
        return `InjectionToken ${this.desc}`;
    }
}

class NullInjector implements Injector {
    get(token: any, notFoundValue: any = NOT_FOUND): any {
        if (notFoundValue === NOT_FOUND) {
            throw new Error(`No provider for ${JSON.stringify(token)}!`);
        }
        return notFoundValue;
    }
}
