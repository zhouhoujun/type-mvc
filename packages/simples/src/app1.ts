import { MvcHostBuilder, MvcServerToken } from '@mvx/mvc';
// import { PlatformServer } from '@tsdi/platform-server';
import { KoaModule } from '@mvx/koa';
import { Bootstrap } from '@tsdi/boot';

@Bootstrap({
    baseURL: __dirname,
    imports: [
        KoaModule
    ],
    builder: MvcHostBuilder,
    bootstrap: MvcServerToken,
    debug: true
})
class MvcApi {
    constructor() {
        console.log('boot application');
    }
}

