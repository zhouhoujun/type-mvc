import { RegFor } from '@tsdi/boot';
import * as controllers from './controllers';
import { MvcModule } from '@mvx/mvc';
import { IdentityModule } from '@mvx/identity';


@MvcModule({
    baseURL: __dirname,
    regFor: RegFor.boot,
    imports: [
        IdentityModule,
        controllers
    ],
    exports: [
        controllers
    ]
})
export class IdentityServiceModule {

}
