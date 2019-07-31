import { Middleware, IMiddleware, IContext, MvcMiddleware, ForbiddenError } from '@mvx/mvc';

@Middleware({ name: 'rightCheck', scope: 'route' })
export class RoleRightCheck extends MvcMiddleware {

    async execute(ctx: IContext, next: () => Promise<void>): Promise<void> {
        // let user = ctx.session.user;
        // todo check user right;
        console.log('check user right.......');
        let hasRight = true;
        if (hasRight) {
            await next();
        } else {
            throw new ForbiddenError();
        }
    }
}
