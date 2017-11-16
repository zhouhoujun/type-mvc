import { createClassDecorator, IClassDecorator, ClassMetadata } from 'type-autofac';


/**
 * controller metadata
 *
 * @export
 * @interface ControllerMetadata
 * @extends {ClassMetadata}
 */
export interface ControllerMetadata extends ClassMetadata {
    /**
     * route prefix.
     *
     * @type {string}
     * @memberof ControllerMetadata
     */
    routePrefix?: string;
}



/**
 * Controller decorator and metadata.
 *
 * @Controller
 */
export const Controller: IClassDecorator = createClassDecorator<ControllerMetadata>('Controller');

