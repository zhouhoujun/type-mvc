import { MvcApplication, MvcModule, MvcServer } from '@mvx/mvc';
import { ModelModule } from '@mvx/model';

@MvcModule({
    imports: [
        ModelModule
        // DebugLogAspect
    ],
    bootstrap: MvcServer
})
class MvcApi {

}


MvcApplication.run(MvcApi);

