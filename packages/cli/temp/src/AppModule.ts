import { MvcApplication, MvcModule } from '@mvx/mvc';
import { TypeOrmModule } from '@mvx/typeorm-adapter'
// import { IdentityModule } from '@mvx/identity';
import { RealtimeService } from './services';

@MvcModule({
    imports: [
        // IdentityModule,
        TypeOrmModule,
        RealtimeService
    ]
})
export class AppModule {

}