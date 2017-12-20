import { IClassMethodDecorator, createClassMethodDecorator, ClassMethodDecorator, Type, MetadataAdapter, MetadataExtends } from 'tsioc';
import { match } from 'minimatch';
import { isArray, isNumber, isString, isUndefined } from 'util';
import { CorsMetadata } from '../metadata';
import { RequestMethod } from '../RequestMethod';

export interface ICorsDecorator<T extends CorsMetadata> extends IClassMethodDecorator<T> {
    (allowMethods?: string | string[] | RequestMethod[], maxAge?: number, allowHeaders?: string | string[]): ClassMethodDecorator
}
export function createCorsDecorator<T extends CorsMetadata>(name: string,
    adapter?: MetadataAdapter,
    metadataExtends?: MetadataExtends<T>): ICorsDecorator<T> {
    return createClassMethodDecorator<CorsMetadata>(name,
        args => {
            if (adapter) {
                adapter(args);
            }
            args.next<CorsMetadata>({
                match: (arg) => isArray(arg) || isString(arg),
                setMetadata: (metatdata, arg) => {
                    if (isString(arg)) {
                        metatdata.allowMethods = arg;
                    } else {
                        let allowMethods = arg as any[];
                        metatdata.allowMethods = allowMethods.filter(m => !isUndefined(m) && m !== null);
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
        }, metadataExtends) as ICorsDecorator<T>

}

export const Cors: ICorsDecorator<CorsMetadata> = createCorsDecorator('Cors');
