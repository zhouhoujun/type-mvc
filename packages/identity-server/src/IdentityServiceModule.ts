import { RegFor } from '@tsdi/boot';
import * as controllers from './controllers';
import { MvcModule } from '@mvx/mvc';
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
    ]
})
export class IdentityServiceModule {

}
