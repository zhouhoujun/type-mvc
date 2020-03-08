import { Injectable, Inject } from '@tsdi/ioc';
import { TypeOrmHelper } from '@tsdi/typeorm-adapter';
import { User } from '../models';

@Injectable()
export class UserSerive {
    @Inject()
    private dao: TypeOrmHelper;

    constructor() {

    }

    async login(user: User): Promise<User> {
        let resp = await this.dao.getRepository(User);
        let rUser = await resp.findOne(user);
        return rUser;
    }

    async profile(user: User): Promise<User> {
        let resp = await this.dao.getRepository(User);
        let rUser = await resp.findOne(user);
        return rUser;
    }

}
