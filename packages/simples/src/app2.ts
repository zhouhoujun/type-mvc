import { MvcHostBuilder, MvcServerToken } from '@mvx/mvc';
// import { PlatformServer } from '@tsdi/platform-server';
import { KoaModule } from '@mvx/koa';
import { DIModule } from '@tsdi/boot';

@DIModule({
    imports: [
        KoaModule
        // DebugLogAspect
    ],
    bootstrap: MvcServerToken
})
class MvcApi {

}


MvcHostBuilder.create(__dirname)
    .useConfiguration({ debug: true })
    .bootstrap(MvcApi);
