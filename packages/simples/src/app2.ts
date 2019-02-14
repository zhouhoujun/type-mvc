import { MvcHostBuilder, MvcServerToken } from '@mvx/mvc';
// import { PlatformServer } from '@ts-ioc/platform-server';
import { KoaModule } from '@mvx/koa';
import { DIModule } from '@ts-ioc/bootstrap';

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
