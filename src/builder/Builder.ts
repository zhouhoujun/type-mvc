import { fileFilter } from '../util';

/**
 * build.
 * @export
 * @interface Builder
 */
export interface Builder {
    /**
     * load source.
     *
     * @param {string[]} match
     * @param {(string | RegExp)} [exp]
     * @returns {Promise<Function[]>}
     *
     * @memberOf Builder
     */
    load(match: string[], exp?: string | RegExp): Promise<Function[]>;
    /**
     * register build.
     *
     * @memberof Builder
     */
    register(): void;
    setup(): void;
}

/**
 * base builder
 */
export abstract class BaseBuilder implements Builder {
    load(match: string[], exp?: string | RegExp): Promise<Function[]> {
        return fileFilter<Function>(match,
            it => {
                let reg = typeof exp === 'string' ? new RegExp(exp) : exp;
                return reg.test(it);
            },
            file => require(file) as Function);
    }

    abstract register(): void;
    abstract setup(): void;

}
