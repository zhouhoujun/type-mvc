import { MvcHostBuilder } from '@mvx/mvc';
import { KoaModule } from '@mvx/koa';

MvcHostBuilder.create(__dirname)
    .use(KoaModule)
    // .useConfiguration()
    // .useContainerBuilder()
    // .useContainer()
    .bootstrap();


