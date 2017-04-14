import { fileFilter } from '../util';
import * as _ from 'lodash';

export interface Builder {
    load(match: string[], exp?: string | RegExp): Promise<Function[]>;
    register(): void;
    setup(): void;
}

export abstract class BaseBuilder implements Builder {
    load(match: string[], exp?: string | RegExp): Promise<Function[]> {
        return fileFilter<Function>(match,
            it => {
                let reg = _.isString(exp) ? new RegExp(exp) : exp;
                return reg.test(it);
            },
            file => require(file) as Function);
    }

    abstract register(): void;
    abstract setup(): void;

}
