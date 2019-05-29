import { DIModule, RegFor } from '@tsdi/boot';
import { TypeOrmHelper } from './TypeOrmHelper';
import { TypeOrmModelParser } from './TypeOrmModelParser';

@DIModule({
    regFor: RegFor.boot,
    imports: [
        TypeOrmHelper,
        TypeOrmModelParser
    ],
    exports: [
        TypeOrmHelper,
        TypeOrmModelParser
    ]
})
export class TypeOrmModule {

}
