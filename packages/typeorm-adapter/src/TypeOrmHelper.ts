import 'reflect-metadata';
import { createConnection, Connection, getConnection, ConnectionOptions, Repository, ObjectType } from 'typeorm';
import { Singleton, Inject, Type, isString, Abstract } from '@tsdi/ioc';
import { MvcContext, MvcContextToken, IConnectionOptions } from '@mvx/mvc';

@Abstract()
export abstract class OrmInitService {
    abstract init(connect: Connection): Promise<void>;
}

@Singleton
export class TypeOrmHelper {

    private hasInit = false;
    constructor(@Inject(MvcContextToken) private ctx: MvcContext) {

    }

    async getRepository<T>(type: Type<T>): Promise<Repository<T>> {
        let conn = await this.getConnection();
        return conn.getRepository<T>(type);
    }

    async getConnection(): Promise<Connection> {
        let options = await this.getOptions()
        if (!this.hasInit) {
            this.hasInit = true;
            try {
                let connect = await createConnection(options as ConnectionOptions);
                if (options.initDb) {
                    await options.initDb(connect);
                }
                let initService = this.ctx.starupServices.getService(OrmInitService);
                if (initService instanceof OrmInitService) {
                    await initService.init(connect);
                }
                return connect;
            } catch (err) {
                console.error(err);
            }
        }
        return await getConnection(options.name);
    }

    private options: IConnectionOptions;
    async getOptions() {
        if (!this.options) {
            let config = this.ctx.configuration;
            let options = config.connections || {} as IConnectionOptions;
            if (!options.entities) {
                let entities: Type[] = [];
                if (config.models.some(m => isString(m))) {
                    let models = await this.ctx.getRaiseContainer().getLoader().loadTypes({ files: config.models, basePath: this.ctx.getRootPath() });
                    models.forEach(ms => {
                        ms.forEach(mdl => {
                            if (mdl && entities.indexOf(mdl) < 0) {
                                entities.push(mdl);
                            }
                        });
                    });
                } else {
                    entities = config.models as Type[];
                }
                options.entities = entities;
            }
            this.options = options as IConnectionOptions;
        }
        return this.options;
    }

}
