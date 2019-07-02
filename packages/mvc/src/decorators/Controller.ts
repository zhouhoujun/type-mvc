import { createClassDecorator, ITypeDecorator, isString, Registration, ArgsIterator } from '@tsdi/ioc';
import { ControllerMetadata } from '../metadata';

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
     * @param {(Registration | symbol | string)} provide define this controller provider for provide.
     * @param {string} [alias] define this controller provider with alias for provide.
     */
    (routePrefix: string, provide?: Registration | symbol | string, alias?: string): ClassDecorator;
    /**
     * Controller decorator. define the class as mvc controller.
     * @Controller
     */
    (target: Function): void;
}

/**
 * Controller decorator, define the class as mvc controller.
 * @Controller
 */
export const Controller: IControllerDecorator<ControllerMetadata> =
    createClassDecorator<ControllerMetadata>('Controller', (args: ArgsIterator) => {
        args.next<ControllerMetadata>({
            match: (arg) => isString(arg),
            setMetadata: (metadata, arg) => {
                metadata.routePrefix = arg;
            }
        });
    }) as IControllerDecorator<ControllerMetadata>;

