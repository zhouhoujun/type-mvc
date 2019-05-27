import { MvcServerToken, MvcApplication, MvcModule } from '@mvx/mvc';
// import { PlatformServer } from '@tsdi/platform-server';
import { DebugLogAspect } from '@tsdi/logs';

@MvcModule({
    imports: [
        // DebugLogAspect
    ],
    bootstrap: MvcServerToken
})
class MvcApi {

}


MvcApplication.run({ module: MvcApi, configures: [{ debug: true }] })

