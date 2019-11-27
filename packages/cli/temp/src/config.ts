import { IConfiguration, IContext } from '@mvx/mvc';
import { LogConfigure } from '@tsdi/logs';
import { Connection } from 'typeorm';
import { User } from './models';
// import { JwtRequest } from '@mvx/identity';
// import { UserService } from './services';

export default {
    // debug: true,
    /**
    * server port
    */
    port: process.env.PORT || 3000,
    keys: ['remotings'],
    /**
     * server host
     */
    hostname: process.env.HOST || '127.0.0.1',
    // debug: true,
    connections: {
        async initDb(connection: Connection) {
            let userRep = connection.getRepository(User);
            let c = await userRep.count();
            if (c < 1) {
                let newUr = new User();
                newUr.name = 'admin';
                newUr.account = 'admin';
                newUr.password = '111111';
                await userRep.save(newUr);
            }
        },
        type: 'postgres',
        host: process.env.DBHOST || 'localhost',
        port: process.env.DBPORT || 5432,
        username: 'postgres',
        password: 'postgres',
        database: 'dbedge',
        synchronize: true, // 同步数据库
        logging: false  // 日志
    },
    // passports: {
    //     default: { strategy: 'jwt', options: { session: false } },
    //     strategies: [
    //         {
    //             strategy: 'jwt',
    //             issuer: '192.168.1.0',
    //             audience: '192.168.1.0',
    //             secretOrKey: 'secret',
    //             jwtFromRequest: JwtRequest.fromAuthHeaderAsBearerToken(),
    //             verify: async (payload: any, ctx?: IContext): Promise<{ user, info }> => {
    //                 if (!payload.data) {
    //                     return { user: null, info: false }
    //                 }
    //                 if (payload.data === '5d2a4ac905c30c31400e5df8') {
    //                     return { user: { id: payload.data, name: 'edge', account: 'edge' }, info: true };
    //                 }
    //                 if (Date.now() / 1000 > payload.exp) {
    //                     return { user: { id: payload.data }, info: false }
    //                 }

    //                 let user = await ctx.getContainer().resolve({ token: UserService, regify: true })
    //                     .verifyJWT(payload.data);
    //                 if (user) {
    //                     return { user, info: true };
    //                 } else {
    //                     return { user: null, info: false };
    //                 }
    //             }
    //         }
    //     ],
    //     serializers: [
    //         async (user: any, ctx: IContext) => {
    //             return user.id.toString();
    //         }
    //     ],
    //     deserializers: [
    //         (obj: any, ctx: IContext) => {
    //             return ctx.getContainer().resolve({ token: UserService, regify: true }).findById(obj.data);
    //         }
    //     ]
    // },
    logConfig: <LogConfigure>{
        adapter: 'log4js',
        config: {
            appenders: <any>{
                remoting: {
                    type: 'dateFile',
                    pattern: '-yyyyMMdd.log',
                    filename: 'logs/remoting',
                    backups: 3,
                    alwaysIncludePattern: true,
                    category: 'remoting'
                },
                console: { type: 'console' }
            },
            categories: {
                default: {
                    appenders: ['remoting', 'console'],
                    level: 'info'
                }
            },
            pm2: true
        }
    }
} as IConfiguration;
