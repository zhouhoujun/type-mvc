import { Suite, Test, Before, After } from '@tsdi/unit';
import { User } from '../src/models/User';
import { MvcApplication } from '@mvx/mvc';
import { BootContext, Service } from '@tsdi/boot';
import { IContainer } from '@tsdi/core';
import { UserService } from '../src/services/UserService';
import * as expect from 'expect';
import { TestModule } from './TestModule';

@Suite('User test')
export class UserTest {
    ctx: BootContext;
    container: IContainer;

    @Before()
    async create() {
        this.ctx = await MvcApplication.run(TestModule);
        this.container = this.ctx.getContainer();
    }

    @Test('can save user or not')
    async save() {
        let userSr = this.container.resolve(UserService);
        expect(userSr instanceof UserService).toBeTruthy();
        let newUr = new User();
        newUr.name = 'admin----test';
        newUr.account = 'admin----test';
        newUr.password = '111111';
        await userSr.save(newUr);
        let svu = await userSr.findByAccount('admin----test')
        // console.log(svu);
        expect(svu instanceof User).toBeTruthy();
        expect(svu.id).toBeDefined();
    }

    @Test('can query data')
    async query() {
        let userSr = this.container.resolve(UserService);
        let admins = await userSr.query();
        console.log(admins);
        expect(admins[1] > 0).toBeTruthy();
    }

    @Test('can query data with keywords')
    async queryKey() {
        let userSr = this.container.resolve(UserService);
        let admins = await userSr.query('admin----test');
        // console.log(admins);
        expect(admins[1]).toEqual(1);
    }

    @After()
    async end() {
        let userSr = this.container.resolve(UserService);
        let svu = await userSr.findByAccount('admin----test');
        await userSr.remove(svu);
        await (<Service>this.ctx.runnable).stop();
        await userSr.db.getConnection().then(c => c.close())
        // process.exit(0);
    }
}
