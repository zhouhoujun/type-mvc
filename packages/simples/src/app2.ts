import {  App, Application, DebugLogAspect, MvcContainer } from '@mvx/mvc';
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
    bootstrap: Application
})
class MvcApi {

}


MvcContainer.create(__dirname)
    .useConfiguration()
    .bootstrap(MvcApi);
