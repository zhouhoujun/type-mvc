import { Suite, Test, Before, After } from '@tsdi/unit';
import { User } from '../src/models/User';
import { MvcApplication, MvcContext } from '@mvx/mvc';
import * as expect from 'expect';
import { TestModule } from './TestModule';
import { UserRepository } from '../src/repositories/UserRepository';

@Suite('User test')
export class UserTest {
    ctx: MvcContext;

    @Before()
    async create() {
        this.ctx = await MvcApplication.run(TestModule);
    }

    @Test('can save user or not')
    async save() {
        let userRep = this.ctx.injector.get(UserRepository);
        expect(userRep).toBeInstanceOf(UserRepository);
        let newUr = new User();
        newUr.name = 'admin----test';
        newUr.account = 'admin----test';
        newUr.password = '111111';
        await userRep.save(newUr);
        let svu = await userRep.findByAccount('admin----test')
        // console.log(svu);
        expect(svu instanceof User).toBeTruthy();
        expect(svu.id).toBeDefined();
    }

    @Test('can query data')
    async query() {
        let userRep = this.ctx.injector.get(UserRepository);
        let admins = await userRep.search();
        expect(admins[1] > 0).toBeTruthy();
    }

    @Test('can query data with keywords')
    async queryKey() {
        let userRep = this.ctx.injector.get(UserRepository);
        let admins = await userRep.search('admin----test');
        // console.log(admins);
        expect(admins[1]).toEqual(1);
    }

    @Test()
    async remove() {
        let userRep = this.ctx.injector.get(UserRepository);
        let svu = await userRep.findByAccount('admin----test');
        await userRep.remove(svu);
        // process.exit(0);
    }

    @After()
    async clean() {
        this.ctx.destroy();
    }
}
