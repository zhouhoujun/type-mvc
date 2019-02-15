import { MvcHostBuilder, MvcServerToken } from '@mvx/mvc';
// import { PlatformServer } from '@ts-ioc/platform-server';
import { KoaModule } from '@mvx/koa';
import { Bootstrap } from '@ts-ioc/bootstrap';

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

