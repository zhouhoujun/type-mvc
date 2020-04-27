import { User } from '../src/models/User';
import { MvcModule } from '@mvx/mvc';
import { RunnableConfigure } from '@tsdi/boot';
import { TypeOrmModule } from '@tsdi/typeorm-adapter';
import { RealtimeService } from '../src/services/RealtimeService';


@MvcModule(<RunnableConfigure>{
    baseURL: __dirname,
    imports: [
        TypeOrmModule
    ],
    providers: [
        RealtimeService
    ],
    models: ['../src/models/**/*.ts'],
    repositories: ['../src/repositories/**/*.ts'],
    connections: {
        name: 'mvc_test',
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: '',
        database: 'testdb',
        useNewUrlParser: true,
        synchronize: true, // 同步数据库
        logging: false  // 日志
        // authSource: 'admin',
        // authMechanism: 'SCRAM-SHA-1'
    }
})
export class TestModule {

}

