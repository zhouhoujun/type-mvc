import { MvcContainer } from '@mvx/mvc';
import { KoaModule } from '@mvx/koa';
import { RouterModule } from '@mvx/router';

MvcContainer.create(__dirname)
    .use(RouterModule)
    .use(KoaModule)
    // .useConfiguration()
    // .useContainerBuilder()
    // .useContainer()
    .bootstrap();


