import * as controllers from './controllers';
import { MvcModule } from '@mvx/mvc';
import { IdentityModule } from '@mvx/identity';
import { TypeOrmModule } from '@tsdi/typeorm-adapter';

@MvcModule({
    baseURL: __dirname,
    regIn: 'root',
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
