import { DIModule } from '@tsdi/boot';
import { ModelModule } from '@mvx/model';

@DIModule({
    imports: [
        ModelModule
    ],
    exports: [
        ModelModule
    ]
})
export class ORMModule {

}
