import { MvcApplication, MvcModule, DefaultMvcMiddlewares, MvcServer, IContext, IConfiguration } from '@mvx/mvc';
import { ModelModule } from '@mvx/model';
// import { PlatformServer } from '@tsdi/platform-server';
import { IdentityModule, JwtRequest } from '@mvx/identity';

@MvcModule({
    // port: 8000,
    imports: [
        ModelModule,
        IdentityModule
    ]
    // middlewares: DefaultMvcMiddlewares,
    // debug: true
})
class MvcApi {
    constructor() {
        console.log('boot application');
    }
}


MvcApplication.run({
    module: MvcApi,
    configures: [
        <IConfiguration>{
            passports: {
                default: { strategy: 'jwt', options: { session: false } },
                strategies: [
                    {
                        strategy: 'jwt',
                        issuer: '192.168.1.0',
                        audience: '192.168.1.0',
                        secretOrKey: 'secret',
                        jwtFromRequest: JwtRequest.fromAuthHeaderAsBearerToken(),
                        verify: async (payload: any, ctx?: IContext): Promise<{ user, info }> => {
                            if (!payload.data) {
                                return { user: null, info: false }
                            }
                            let user = { user: { id: payload.data, name: 'edge', account: 'edge' }, info: true };
                            if (user) {
                                return { user, info: true };
                            } else {
                                return { user: null, info: false };
                            }
                        }
                    }
                ],
                serializers: [
                    async (user: any, ctx: IContext) => {
                        return user.id.toString();
                    }
                ],
                deserializers: [
                    (obj: any, ctx: IContext) => {
                        return <any>{ name: 'edge', account: 'edge' };
                    }
                ]
            }
        }
    ]
});
