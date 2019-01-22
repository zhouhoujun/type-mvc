import { MvcHostBuilder, App } from '@mvx/mvc';
// import { PlatformServer } from '@ts-ioc/platform-server';
import { KoaModule } from '@mvx/koa';
@App({
    imports: [
        KoaModule
    ],
    debug: false
})
class MvcApi {
    constructor() {
        console.log('my extends application');
    }
}

MvcHostBuilder.create(__dirname)
    .useConfiguration()
    .run(MvcApi);
