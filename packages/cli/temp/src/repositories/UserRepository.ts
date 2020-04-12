import { EntityRepository, Repository } from 'typeorm';
import { User } from '../models/User';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    async findById(id: string) {
        return await this.findOne(id);
    }

    async findByAccount(name: string) {
        return await this.findOne({ where: { account: name } });
    }

    async removeById(id: string) {
        let user = await this.findOne(id);
        return await this.remove(user);
    }

    async search(keywords?: string, skip?: number, take?: number): Promise<[User[], number]> {
        let sqb = this.createQueryBuilder('user')
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
