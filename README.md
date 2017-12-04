# packaged type-mvc

This repo is for distribution on `npm`. The source for this module is in the
[main repo](https://github.com/zhouhoujun/type-mvc).

type-mvc is base on koa, with typescript. type and decorators mvc frameworker on server. base on ioc [`tsioc`](https://www.npmjs.com/package/tsioc). help you develop your project easily.



## Install

You can install this package either with `npm`

### npm

```shell

npm install type-mvc

```



## Documentation

## Start 

create application

```ts
import { Bootstrap } from 'type-mvc';

Bootstrap.create(__dirname)
    .useConfiguration()
    //.use(middleware: IMiddleware | Middleware | Token<any>)
    //.useContainerBuilder(...)
    .run();

```

### Define Model

```ts
import { Model, Field } from 'type-mvc';

@Model
export class User {
    @Field
    name: string;
    @Field
    sex: string;
    @Field
    age: number;
}
```

### Define Controller

default setting load controllers in your project folder
`/controllers`

 * Each Controller action should return type `ResultValue`, also you can return object, it deal with JsonResult. return string deal with ViewResult.
 * The action can be `async` or `sync`. Have provide `FileResult`, `JsonResult`,
`RedirectResult`, `ViewResult`.
 * Also, you can extend with `BaseController`, it has implements some mothod to create the `ResultValue` types.
 * Model can auto create in action, it auto load value from request body.

define as:

```ts
import { Controller, Get, Post, IContext, symbols, Model, Field } from 'type-mvc';
import { Inject } from 'tsioc';
import { Mywork } from '../bi/Mywork';
import { User } from '../models';


@Controller('/users')
export class UserController {

    // @Inject(symbols.IContext)
    // context: IContext;
    constructor(private work: Mywork) {

    }

    @Get('')
    index() {
        console.log('home index invorked', this.work);
        return this.work.workA();
    }


    @Post('/add')
    async addUser(user: User, @Inject(symbols.IContext) ctx: IContext) {
        console.log('user:', User);
        console.log('request body', ctx.request['body']);
        return this.work.save(user);
    }

    @Get('/sub')
    sub() {
        return this.work.workB();
    }

    @Get('/:name')
    getPerson(name: string) {
        return this.work.find(name);
    }

    @Get('/find/:name')
    query(name: string, @Inject(symbols.IContext) ctx) {
        console.log(ctx);
        return this.work.find(name);
    }

    @Get('/test/:id')
    parmtest(id: number) {
        if (id === 1) {
            return this.work.workA();
        } else if (id === 2) {
            return this.work.workB();
        } else {
            return 'notFound';
        }
    }

    @Post('/posttest/:id')
    postTest(id: number) {
        return {
            id: id
        }
    }

}


@Controller('/')
export class HomeController extends BaseController {

    // @Inject(symbols.IContext)
    // context: IContext;
    constructor() {
        super();
    }

    @Get('')
    index(): ResultValue {
        return this.view('index.html');
    }

    @Get('/index2')
    home2(): ResultValue {
        return this.view('index2.html');
    }

    @Post('/goto/:pageName')
    gotoPage(pageName: string): ResultValue {
        return this.redirect( '/' + pageName);
    }
}


```


### Define Middlewares

default setting load middlewares in your project foler
`/middlewares`

```ts
import { Middleware, IMiddleware, Application, Configuration } from 'type-mvc';
import { IContainer, Injectable } from 'tsioc';


@Middleware({ provide: 'logger' })
export class Logger implements IMiddleware {

    constructor(private app: Application, private config: Configuration) {

    }

    setup() {
        this.app.use(async (ctx, next) => {
            let start = Date.now();
            await next();
            const ms = Date.now() - start;
            console.log(`mylog: ${ctx.method} ${ctx.url} - ${ms}ms`);
            let end = new Date();
        });
    }

}

```




## Simples

[see simples](https://github.com/zhouhoujun/type-mvc/tree/master/src/simples)
## License

MIT © [Houjun](https://github.com/zhouhoujun/)