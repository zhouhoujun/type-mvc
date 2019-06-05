import 'reflect-metadata';
import { createConnection, Connection, getConnection, ConnectionOptions, Repository } from 'typeorm';
import { Singleton, Inject, Type, isString } from '@tsdi/ioc';
import { MvcContext, MvcContextToken, IConnectionOptions } from '@mvx/mvc';


@Singleton
export class TypeOrmHelper {

    private hasInit = false;
    constructor(@Inject(MvcContextToken) private ctx: MvcContext) {

    }

    async getRepository<T>(type: Type<T>): Promise<Repository<T>> {
        let conn = await this.getConnection();
        return conn.getRepository(type);
    }

    async getConnection(): Promise<Connection> {
        let options = await this.getOptions()
        if (!this.hasInit) {
            this.hasInit = true;
            return await createConnection(options);
        }
        return await getConnection(options.name);
    }

    private options: ConnectionOptions;
    async getOptions() {
        if (!this.options) {
            let config = this.ctx.configuration;
            let options = config.connections || {} as IConnectionOptions;
            if (!options.entities) {
                let entities: Type<any>[] = [];
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
                    entities = config.models as Type<any>[];
                }
                options.entities = entities;
            }
            this.options = options as ConnectionOptions;
        }
        return this.options;
    }

}
