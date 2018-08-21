import { MvcContainer, App, Application, DebugLogAspect } from '@mvx/mvc';
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
class MvcApi extends Application {
    constructor() {
        super();
        console.log('my extends application');
    }
}


MvcContainer.create(__dirname)
    .useConfiguration()
    .bootstrap(MvcApi);
