import {  App, MvcApplication, DebugLogAspect, MvcHostBuilder } from '@mvx/mvc';
// import { PlatformServer } from '@ts-ioc/platform-server';
import { KoaModule } from '@mvx/koa';
import { RouterModule } from '@mvx/router';

@App({
    imports: [
        KoaModule,
        RouterModule,
        // DebugLogAspect
    ],
    debug: true,
    bootstrap: MvcApplication
})
class MvcApi {

}


MvcHostBuilder.create(__dirname)
    .useConfiguration()
    .bootstrap(MvcApi);
