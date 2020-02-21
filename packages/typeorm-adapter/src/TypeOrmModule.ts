import { DIModule } from '@tsdi/boot';
import { TypeOrmHelper } from './TypeOrmHelper';
import { TypeOrmModelParser } from './TypeOrmModelParser';

@DIModule({
    regIn: 'root',
    providers: [
        TypeOrmHelper,
        TypeOrmModelParser
    ]
})
export class TypeOrmModule {

}
