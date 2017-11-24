import { Bootstrap, RouterMiddleware } from '../index';

Bootstrap.create(__dirname)
    .useConfiguration()
    // .useContainerBuilder()
    // .useContainer()
    .run();


