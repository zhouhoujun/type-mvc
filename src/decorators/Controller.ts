import { createClassDecorator, IClassDecorator, TypeMetadata } from 'type-autofac';
import { ControllerMetadata } from './metadata/ControllerMetadata';


/**
 * Controller decorator and metadata.
 *
 * @Controller
 */
export const Controller: IClassDecorator<ControllerMetadata> =
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

