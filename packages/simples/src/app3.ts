import { MvcApplication, MvcModule, DefaultMvcMiddlewares, MvcServer } from '@mvx/mvc';
import { ModelModule } from '@mvx/model';
// import { PlatformServer } from '@tsdi/platform-server';
import { OAuthModule } from '@mvx/oauth';

@MvcModule({
    imports: [
        ModelModule,
        OAuthModule
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
