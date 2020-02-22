import { DIModule } from '@tsdi/boot';
import { DefaultModelParser } from './ModelParser';


@DIModule({
    regIn: 'root',
    providers: [
        DefaultModelParser
    ]
})
export class ModelModule {

}
