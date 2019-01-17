import { MvcHostBuilder } from '@mvx/mvc';
import { KoaModule } from '@mvx/koa';
import { RouterModule } from '@mvx/router';

MvcHostBuilder.create(__dirname)
    .use(RouterModule)
    .use(KoaModule)
    // .useConfiguration()
    // .useContainerBuilder()
    // .useContainer()
    .bootstrap();


