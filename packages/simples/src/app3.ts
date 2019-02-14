import { MvcHostBuilder, App, MvcServerToken } from '@mvx/mvc';
// import { PlatformServer } from '@ts-ioc/platform-server';
import { KoaModule } from '@mvx/koa';
import { Bootstrap } from '@ts-ioc/bootstrap';

@Bootstrap({
    imports: [
        KoaModule
    ],
    bootstrap: MvcServerToken,
    debug: true
})
class MvcApi {
    constructor() {
        console.log('boot application');
    }

    static main() {
        console.log('run mvc api...');
        MvcHostBuilder.create()
            .bootstrap(MvcApi);
    }
}

// MvcHostBuilder.create(__dirname)
//     .useConfiguration()
//     .run(MvcApi);
