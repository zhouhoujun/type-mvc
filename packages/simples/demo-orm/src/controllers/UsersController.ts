import { Controller, Get, Post, Cors, Put, Authorization, Delete, IContext, ContextToken } from '@mvx/mvc';
import { User } from '../models/User';
import { Inject } from '@tsdi/ioc';
import { ResponseResult } from '../ResponseResult';
import { UserRepository } from '../repositories/UserRepository';

@Cors
@Authorization('admin')
@Controller('/api/users')
export class UserController {

    @Inject(ContextToken)
    context: IContext;

    constructor(private repos: UserRepository) {
    }

    // @Post('/')
    // async add(user: User) {
    //     let r = await this.repos.save(user);
    //     return ResponseResult.success(r);
    // }

    // @Put('/')
    // async middfy(user: User) {
    //     let r = await this.repos.save(user);
    //     return ResponseResult.success(r);
    // }

    @Put('/')
    @Post('/')
    async save(user: User) {
        let r = await this.repos.save(user);
        return ResponseResult.success(r);
    }


    @Get('/:id')
    async get(id: string) {
        let user = this.repos.findById(id);
        return ResponseResult.success(user);
    }

    @Delete('/:id')
    async remove(id: string) {
        let user = await this.repos.removeById(id);
        return ResponseResult.success(user);
    }

    @Get('/')
    async query(keywords: string, skip?: number, take?: number) {
        const [ users, total ] = await this.repos.search(keywords, skip, take);
        return ResponseResult.success(users, total);
    }

}
