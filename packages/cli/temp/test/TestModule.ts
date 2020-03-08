import { User } from '../src/models';
import { MvcModule } from '@mvx/mvc';
import { RunnableConfigure } from '@tsdi/boot';
import { TypeOrmModule } from '@tsdi/typeorm-adapter';
import { UserService } from '../src/services';


@MvcModule(<RunnableConfigure>{
    imports: [
        TypeOrmModule,
        UserService
    ],
    connections: {
        name: 'mvc_test',
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        database: 'mvc_test',
        entities: [
            User
        ],
        useNewUrlParser: true,
        synchronize: true, // 同步数据库
        logging: false  // 日志
        // authSource: 'admin',
        // authMechanism: 'SCRAM-SHA-1'
    }
})
export class TestModule {

}

