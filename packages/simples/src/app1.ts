import { MvcHostBuilder, App, MvcApplication, DebugLogAspect } from '@mvx/mvc';
// import { PlatformServer } from '@ts-ioc/platform-server';
import { KoaModule } from '@mvx/koa';
import { RouterModule } from '@mvx/router';
@App({
    imports: [
        KoaModule,
        RouterModule,
        DebugLogAspect
    ],
    debug: false
})
class MvcApi extends MvcApplication {
    constructor() {
        super();
        console.log('my extends application');
    }
}

MvcHostBuilder.create(__dirname)
    .useConfiguration()
    .run(MvcApi);
