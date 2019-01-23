import {  App, MvcHostBuilder, Application, MvcServerToken } from '@mvx/mvc';
// import { PlatformServer } from '@ts-ioc/platform-server';
import { KoaModule } from '@mvx/koa';

@App({
    imports: [
        KoaModule
        // DebugLogAspect
    ],
    debug: true,
    bootstrap: MvcServerToken
})
class MvcApi {

}


MvcHostBuilder.create(__dirname)
    .useConfiguration()
    .bootstrap(MvcApi);
