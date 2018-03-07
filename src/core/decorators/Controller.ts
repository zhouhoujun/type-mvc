import { createClassDecorator, IClassDecorator, TypeMetadata, Type, isClass, isString, Registration, ArgsIterator, isClassMetadata } from 'tsioc';
import { ControllerMetadata } from '../metadata/index';

/**
 * Controller decorator define.
 *
 * @export
 * @interface IControllerDecorator
 * @template T
 */
export interface IControllerDecorator<T extends ControllerMetadata> extends IClassDecorator<T> {
    (routePrefix: string, provide?: Registration<any> | string, alias?: string): ClassDecorator;
    (target: Function): void;
}

/**
 * Controller decorator and metadata.
 *
 * @Controller
 */
export const Controller: IControllerDecorator<ControllerMetadata> =
    createClassDecorator<ControllerMetadata>('Controller', (args: ArgsIterator) => {
        args.next<ControllerMetadata>({
            isMetadata: (arg) => isClassMetadata(arg, ['routePrefix']),
            match: (arg) => isString(arg),
            setMetadata: (metadata, arg) => {
                metadata.routePrefix = arg;
            }
        });
    }) as IControllerDecorator<ControllerMetadata>;

