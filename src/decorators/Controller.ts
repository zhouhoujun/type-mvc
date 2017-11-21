import { createClassDecorator, IClassDecorator, TypeMetadata } from 'type-autofac';
import { ControllerMetadata } from './metadata/ControllerMetadata';

/**
 * Controller decorator define.
 *
 * @export
 * @interface IControllerDecorator
 * @template T
 */
export interface IControllerDecorator<T extends ControllerMetadata> extends IClassDecorator<T> {
    (routePrefix?: string): ClassDecorator;
    (target: Function): void;
}

/**
 * Controller decorator and metadata.
 *
 * @Controller
 */
export const Controller: IControllerDecorator<ControllerMetadata> =
    createClassDecorator<ControllerMetadata>('Controller', (...args: any[]) => {
        let metadata;
        if (args.length > 0 && args[0]) {
            if (typeof args[0] === 'string') {
                metadata = {
                    routePrefix: args[0],
                } as ControllerMetadata;
            }
        }
        return metadata;
    });

