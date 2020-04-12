import { Inject, Singleton } from '@tsdi/ioc';
import { User } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';

@Singleton()
export class UserService {

    @Inject() private userRep: UserRepository;

    constructor() {

    }

    async verify(username: string, password: string) {
        let user = await this.userRep.findOne({ where: { account: username } });
        if (!user || user.password !== password) {
            return { user: null, info: false };
        }
        return { user, info: true };
    }

    async verifyJWT(id: string) {
        let user = await this.userRep.findOne(id);
        return user;
    }

}
