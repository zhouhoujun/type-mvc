import { DIModule } from '@tsdi/boot';
import { BaseTypeParser } from './BaseTypeParser';
import { ModelParser } from './ModelParser';


@DIModule({
    imports: [
        BaseTypeParser,
        ModelParser
    ],
    exports: [
        BaseTypeParser,
        ModelParser
    ]
})
export class ModelModule {

}
