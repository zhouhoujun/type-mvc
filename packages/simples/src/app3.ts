import { MvcApplication, MvcModule, DefaultMvcMiddlewares, MvcServer } from '@mvx/mvc';
import { ModelModule } from '@mvx/model';
// import { PlatformServer } from '@tsdi/platform-server';


@MvcModule({
    imports: [
        ModelModule
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

// MvcHostBuilder.create(__dirname)
//     .useConfiguration()
//     .run(MvcApi);
