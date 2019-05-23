import { MvcHostBuilder, MvcServerToken } from '@mvx/mvc';
// import { PlatformServer } from '@tsdi/platform-server';
import { KoaModule } from '@mvx/koa';
import { Bootstrap } from '@tsdi/boot';

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
        MvcHostBuilder.create(__dirname)
            .useConfiguration({ debug: true })
            .bootstrap(MvcApi);
    }
}

// MvcHostBuilder.create(__dirname)
//     .useConfiguration()
//     .run(MvcApi);
