import { DIModule, RegFor } from '@tsdi/boot';
import { DefaultModelParser } from './ModelParser';


@DIModule({
    regFor: RegFor.boot,
    imports: [
        DefaultModelParser
    ],
    exports: [
        DefaultModelParser
    ]
})
export class ModelModule {

}
