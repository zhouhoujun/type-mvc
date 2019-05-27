import { MvcModule } from './decorators';
import { DefaultMvcMiddlewares } from './DefaultMvcMiddlewares';
import { MvcServer } from './MvcServer';


@MvcModule({
    middlewares: DefaultMvcMiddlewares,
    bootstrap: MvcServer
})
export class MvcApp {

}
