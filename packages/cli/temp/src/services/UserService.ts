import { Inject, Singleton } from '@tsdi/ioc';
import { TypeOrmHelper } from '@tsdi/typeorm-adapter';
import { User } from '../models/User';

@Singleton()
export class UserService {

    @Inject()
    db: TypeOrmHelper;

    constructor() {

    }

    async verify(username: string, password: string) {
        let userRep = await this.db.getRepository(User);
        let user = await userRep.findOne({ where: { account: username } });
        if (!user || user.password !== password) {
            return { user: null, info: false };
        }
        return { user, info: true };
    }

    async verifyJWT(id: string) {
        let userRep = await this.db.getRepository(User);
        let user = await userRep.findOne(id);
        return user;
    }

    async save(user: User) {
        let userRep = await this.db.getRepository(User);
        return await userRep.save(user);
    }

    async findById(id: string) {
        let rep = await this.db.getRepository(User);
        return await rep.findOne(id);
    }

    async findByAccount(name: string) {
        let rep = await this.db.getRepository(User);
        return await rep.findOne({ where: { account: name } });
    }

    async removeById(id: string) {
        let rep = await this.db.getRepository(User);
        let user = await rep.findOne(id);
        return await rep.remove(user);
    }

    async remove(user: User) {
        let rep = await this.db.getRepository(User);
        return await rep.remove(user);
    }

    async query(keywords?: string, skip?: number, take?: number): Promise<[User[], number]> {
        let rep = await this.db.getRepository(User);
        let sqb = rep.createQueryBuilder('user')
            .leftJoinAndSelect('user.role', 'role');
        if (keywords) {
            sqb = sqb
                .where('user.name LIKE :param')
                .orWhere('user.account LIKE :param')
                .orWhere('user.email LIKE :param')
                .orWhere('user.phone LIKE :param')
                .setParameter('param', `%${keywords}%`)
        }
        return await sqb.orderBy('user.name', 'ASC')
            .skip(skip)
            .take(take)
            .getManyAndCount();
    }

}
