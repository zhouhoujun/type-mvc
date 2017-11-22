import { ClassMetadata, IClassDecorator, createClassDecorator, Registration, ArgsIterator, isClassMetadata } from 'type-autofac';
import { IRouteDecorator, createRouteDecorator } from './Route';
import { RouterMetadata } from './metadata';
import { isString } from 'util';



/**
 * Router decorator define.
 *
 * @export
 * @interface IRouterDecorator
 * @template T
 */
export interface IRouterDecorator<T extends RouterMetadata> extends IClassDecorator<T> {
    (routePrefix: string, provide?: Registration<any> | string, alias?: string): ClassDecorator;
    (target: Function): void;
}

/**
 * Router decorator and metadata.
 *
 * @Router
 */
export const Router: IRouterDecorator<RouterMetadata> =
    createClassDecorator<RouterMetadata>('Router', (args: ArgsIterator) => {
        args.next<RouterMetadata>({
            isMetadata: (arg) => isClassMetadata(arg, ['routePrefix']),
            match: (arg) => isString(arg),
            setMetadata: (metadata, arg) => {
                metadata.routePrefix = arg;
            }
        });
    }) as IRouterDecorator<RouterMetadata>;
