import { MvcApplication, MvcModule } from '@mvx/mvc';
import { TypeOrmModule } from '@tsdi/typeorm-adapter'
import { IdentityModule } from '@mvx/identity';
import { RealtimeService } from './services/RealtimeService';

@MvcModule({
    imports: [
        IdentityModule,
        TypeOrmModule
    ],
    providers: [
        RealtimeService
    ]
})
export class AppModule {

}
