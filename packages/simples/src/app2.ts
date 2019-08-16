import { MvcApplication, MvcModule, MvcServer } from '@mvx/mvc';
import { DebugLogAspect } from '@tsdi/logs';
import { ModelModule } from '@mvx/model';

@MvcModule({
    imports: [
        ModelModule,
        // DebugLogAspect
    ],
    bootstrap: MvcServer
})
class MvcApi {

}


MvcApplication.run({ module: MvcApi, configures: [{ debug: true }] })

