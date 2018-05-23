import { Bootstrap, AppModule, Application, DebugLogAspect } from '../index';

@AppModule({
    // imports: [DebugLogAspect],
    debug: false,
    bootstrap: Application
})
class MvcApi {

}

Bootstrap.create(__dirname)
    .useConfiguration()
    .bootstrap(MvcApi);
