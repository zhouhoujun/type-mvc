import { Type, Singleton, Inject } from '@tsdi/ioc';
import { AuthorizationService, IContext, MiddlewareType, Authorization, IConfiguration } from '@mvx/mvc';
import { AuthenticatorToken, IAuthenticator } from '../passports';

@Singleton()
export class AuthFlowService extends AuthorizationService {
    @Inject(AuthenticatorToken)
    passport: IAuthenticator;

    getAuthMiddlewares(ctx: IContext, controller: Type<any>): MiddlewareType[];
    getAuthMiddlewares(ctx: IContext, controller: Type<any>, propertyKey: string): MiddlewareType[];
    getAuthMiddlewares(ctx: IContext, controller: Type<any>, propertyKey?: any) {
        let middlewares = [];
        let mvcCtx = ctx.mvcContext;
        let configuration: IConfiguration = mvcCtx.getConfiguration();
        let flowOption = configuration.passports.default;
        if (!flowOption) {
            return middlewares;
        }

        let refl = mvcCtx.reflects;
        if (propertyKey) {
            if (refl.hasMethodMetadata(Authorization, controller, propertyKey)) {
                middlewares.push(this.passport.authenticate(flowOption.strategy, flowOption.options));
            }
        } else if (refl.hasMetadata(Authorization, controller)) {
            middlewares.push(this.passport.authenticate(flowOption.strategy, flowOption.options));
        }

        return middlewares;
    }

}
