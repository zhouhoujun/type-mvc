import { AuthorizationService, IContext, MiddlewareType, Authorization, IConfiguration } from '@mvx/mvc';
import { Type, Singleton, hasMethodMetadata, hasOwnClassMetadata, Inject } from '@tsdi/ioc';
import { AuthenticatorToken, IAuthenticator } from '../passports';

@Singleton()
export class AuthFlowService extends AuthorizationService {
    @Inject(AuthenticatorToken)
    passport: IAuthenticator;

    getAuthMiddlewares(ctx: IContext, controller: Type<any>): MiddlewareType[];
    getAuthMiddlewares(ctx: IContext, controller: Type<any>, propertyKey: string): MiddlewareType[];
    getAuthMiddlewares(ctx: IContext, controller: Type<any>, propertyKey?: any) {
        let middlewares = [];
        let configuration = ctx.mvcContext.configuration as IConfiguration;
        let flowOption = configuration.passports.default;
        if (!flowOption) {
            return middlewares;
        }

        if (propertyKey) {
            if (hasMethodMetadata(Authorization, controller, propertyKey)) {
                middlewares.push(this.passport.authenticate(flowOption.strategy, flowOption.options));
            }
        } else if (hasOwnClassMetadata(Authorization, controller)) {
            middlewares.push(this.passport.authenticate(flowOption.strategy, flowOption.options));
        }

        return middlewares;
    }

}
