import { Controller, Get, Post, Cors, Put, Authorization, Delete, IContext, ContextToken } from '@mvx/mvc';
import { User } from '../models/User';
import { UserService } from '../services/UserService';
import { Inject } from '@tsdi/ioc';
import { ResponseResult } from '../ResponseResult';

@Cors
@Authorization('admin')
@Controller('/api/users')
export class UserController {

    @Inject(ContextToken)
    context: IContext;

    constructor(private service: UserService) {
    }

    @Post('/')
    async add(user: User) {
        let r = await this.service.save(user);
        return ResponseResult.success(r);
    }

    @Put('/')
    async middfy(user: User) {
        let r = await this.service.save(user);
        return ResponseResult.success(r);
    }


    @Get('/:id')
    async get(id: string) {
        let user = this.service.findById(id);
        return ResponseResult.success(user);
    }

    @Delete('/:id')
    async remove(id: string) {
        let user = await this.service.removeById(id);
        return ResponseResult.success(user);
    }

    @Get('/')
    async query(keywords: string, skip?: number, take?: number) {
        let query = await this.service.query(keywords, skip, take);
        return ResponseResult.success(query[0], query[1]);
    }

}
