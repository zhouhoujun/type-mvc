import { Bootstrap } from '../index';


let app = Bootstrap.create(__dirname);
app.useConfiguration()
    // .useContainerBuilder()
    // .useContainer()
    .run()


