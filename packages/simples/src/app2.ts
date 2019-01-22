import {  App, MvcHostBuilder, Application } from '@mvx/mvc';
// import { PlatformServer } from '@ts-ioc/platform-server';
import { KoaModule } from '@mvx/koa';

@App({
    imports: [
        KoaModule
        // DebugLogAspect
    ],
    debug: true,
    bootstrap: Application
})
class MvcApi {

}


MvcHostBuilder.create(__dirname)
    .useConfiguration()
    .bootstrap(MvcApi);
