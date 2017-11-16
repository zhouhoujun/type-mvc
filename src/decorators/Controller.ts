import { TypeDecorator, makeDecorator, makePropDecorator } from './decorators';
import { MvcContext } from '../MvcContext';
import { Buffer } from 'buffer';
import { Stream } from 'stream';

/**
 * Type of the Controller metadata.
 *
 * @stable
 */
export interface IController {
    context?: MvcContext;
}

/**
 * Type of the Controller decorator / constructor function.
 *
 * @stable
 */
export interface ControllerDecorator {
    (routePrefix?: string): TypeDecorator;
    new (routePrefix?: string): IController;
}



/**
 * Controller decorator and metadata.
 *
 * @stable
 * @Annotation
 */
export const Controller: ControllerDecorator = makeDecorator('Controller', { routePrefix: undefined }) as ControllerDecorator;

