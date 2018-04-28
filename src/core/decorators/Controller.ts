import { createClassDecorator, ITypeDecorator, TypeMetadata, Type, isClass, isString, Registration, ArgsIterator, isClassMetadata } from '@ts-ioc/core';
import { ControllerMetadata } from '../metadata/index';

/**
 * Controller decorator, define the class as mvc controller.
 * @Controller
 *
 * @export
 * @interface IControllerDecorator
 * @template T
 */
export interface IControllerDecorator<T extends ControllerMetadata> extends ITypeDecorator<T> {
    /**
     * Controller decorator. define the class as mvc controller.
     * @Controller
     *
     * @param {string} routePrefix route prefix of this controller.
     * @param {(Registration<any> | symbol | string)} provide define this controller provider for provide.
     * @param {string} [alias] define this controller provider with alias for provide.
     */
    (routePrefix: string, provide?: Registration<any> | symbol | string, alias?: string): ClassDecorator;
    (target: Function): void;
}

/**
 * Controller decorator, define the class as mvc controller.
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

