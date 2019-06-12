import { MvcApplication, MvcModule, DefaultMvcMiddlewares, MvcServer } from '@mvx/mvc';
import { ModelModule } from '@mvx/model';
// import { PlatformServer } from '@tsdi/platform-server';
import { IdentityServiceModule } from '@mvx/identity-server';
import { IdentityModule } from '@mvx/identity';

@MvcModule({
    imports: [
        ModelModule,
        IdentityModule
    ],
    subSites: [
        { app: IdentityServiceModule, routePrefix: '/api' }
    ],
    middlewares: DefaultMvcMiddlewares,
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
