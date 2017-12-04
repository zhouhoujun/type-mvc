import { IClassMethodDecorator, createClassMethodDecorator, ClassMethodDecorator, Type } from 'tsioc';
import { match } from 'minimatch';
import { isArray, isNumber, isString } from 'util';
import { CorsMetadata } from './metadata';
import { RequestMethod } from '../RequestMethod';

export interface ICorsdDecorator extends IClassMethodDecorator<CorsMetadata> {
}
export const Cors: IClassMethodDecorator<CorsMetadata> = createClassMethodDecorator<CorsMetadata>('Cors',
    args => {
        args.next<CorsMetadata>({
            match: (arg) => isArray(arg) || isString(arg),
            setMetadata: (metatdata, arg) => {
                if (isString(arg)) {
                    metatdata.allowMethods = arg;
                } else {
                    let allowMethods = arg as RequestMethod[];
                    metatdata.allowMethods = allowMethods.filter(m => isNumber(m));
                }
            }
        });
        args.next<CorsMetadata>({
            match: (arg) => isNumber(arg),
            setMetadata: (metatdata, arg) => {
                metatdata.maxAge = arg;
            }
        });
        args.next<CorsMetadata>({
            match: (arg) => isArray(arg),
            setMetadata: (metatdata, arg) => {
                let allowHeaders = arg as string[];
                metatdata.allowHeaders = allowHeaders.filter(h => !!h);
            }
        });
    }
);
