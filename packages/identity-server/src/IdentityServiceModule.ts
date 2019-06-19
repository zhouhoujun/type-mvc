import { RegFor } from '@tsdi/boot';
import * as controllers from './controllers';
import { MvcModule, getMvcMiddlewares } from '@mvx/mvc';
import { IdentityModule } from '@mvx/identity';
import { TypeOrmModule } from '@mvx/typeorm-adapter';

@MvcModule({
    baseURL: __dirname,
    regFor: RegFor.boot,
    imports: [
        TypeOrmModule,
        IdentityModule,
        controllers
    ],
    exports: [
        TypeOrmModule,
        controllers
    ],
    middlewares: getMvcMiddlewares(false)
})
export class IdentityServiceModule {

}
