import { MvcApplication, MvcModule, DefaultMvcMiddlewares } from '@mvx/mvc';
// import { PlatformServer } from '@tsdi/platform-server';


@MvcModule({
    imports: [],
    middlewares: DefaultMvcMiddlewares,
    debug: true
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
