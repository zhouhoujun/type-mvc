import { RegFor } from '@tsdi/boot';
import * as controllers from './controllers';
import * as vaildates from './vaildates';
import { MvcModule } from '@mvx/mvc';

@MvcModule({
    regFor: RegFor.boot,
    imports: [
        controllers,
        vaildates
    ],
    exports: [
        controllers,
        vaildates
    ]
})
export class OAuthModule {

}
