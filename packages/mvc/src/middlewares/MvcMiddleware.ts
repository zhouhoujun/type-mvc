import { Handle, CompositeHandle } from '@tsdi/boot';
import { IContext } from '../IContext';
import { IMiddleware } from '../IMiddleware';

/**
 * middleware
 *
 * @export
 * @abstract
 * @class Middleware
 * @extends {Handle<MvcContext>}
 * @implements {IMiddleware}
 */
export abstract class MvcMiddleware extends Handle<IContext> implements IMiddleware {

}

export class CompositeMiddleware extends CompositeHandle<IContext> {

}
