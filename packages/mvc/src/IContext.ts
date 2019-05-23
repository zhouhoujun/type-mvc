import { ObjectMap, InjectToken } from '@tsdi/ioc'

/**
 * context token.
 */
export const ContextToken = new InjectToken<IContext>('MVX_IContext');

/**
 * mvc IContext.
 * @export
 * @interface IContext
 * @extends {Context}
 */
export interface IContext extends ObjectMap<any> {

}

