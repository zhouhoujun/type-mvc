import { Bootstrap, AppModule, Application, DebugLogAspect } from '../index';
// import { PlatformServer } from '@ts-ioc/platform-server';

@AppModule({
    imports: [DebugLogAspect],
    debug: false
})
class MvcApi extends Application {
    constructor() {
        super();
        console.log('my extends application');
    }
}


Bootstrap.create(__dirname)
    .useConfiguration()
    .bootstrap(MvcApi);
