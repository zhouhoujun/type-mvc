import { MvcApplication, MvcModule, DefaultMvcMiddlewares, MvcServer } from '@mvx/mvc';
import { ModelModule } from '@mvx/model';
// import { PlatformServer } from '@tsdi/platform-server';
import { IdentityModule } from '@mvx/identity';
const port = 3000;
const oauthProviderId = 'markus';
@MvcModule({
    // port: 8000,
    imports: [
        ModelModule,
        IdentityModule
    ],
    passports: {
        strategies: [
            {
                strategy: 'oidc',
                scope: 'openid email profile',
                issuer: 'http://localhost:' + port,
                clientID: 'markus01',
                clientSecret: 'markus01',
                authorizationURL: 'http://localhost:' + port + '/oidc/endpoint/' + oauthProviderId + '/authorize',
                tokenURL: 'http://localhost:' + port + '/token',
                callbackURL: 'http://localhost:3000/callback',
                userInfoURL: 'http://localhost:' + port + '/me'
            }
        ]
    }
    // middlewares: DefaultMvcMiddlewares,
    // debug: true
})
class MvcApi {
    constructor() {
        console.log('boot application');
    }

    static main() {
        console.log('run mvc api...');
        MvcApplication.run(MvcApi);
    }
}
