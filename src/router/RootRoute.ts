import { BaseRoute } from './BaseRoute';
import { IContainer } from 'tsioc';
import { IContext } from '../IContext';


export class RootRoute extends BaseRoute {
    navigating(container: IContainer, ctx: IContext): Promise<any> {
        return this.match(ctx).navigating(container, ctx);
    }
}
