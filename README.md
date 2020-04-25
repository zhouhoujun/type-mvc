# packaged @mvx/mvc

This repo is for distribution on `npm`. The source for this module is in the
[main repo](https://github.com/zhouhoujun/type-mvc).

`@mvx/mvc` is Decorator, Ioc, AOP MVC frameworker. base on ioc [`@tsdi`](https://www.npmjs.com/package/@tsdi/core). help you develop your project easily.



## Install

You can install this package either with `npm`

### npm

```shell

npm install @mvx/mvc

```

## Install CLI

### cli in global

```shell
npm install -g '@mvx/cli'
```

```shell
  mvx --help  //show help
  mvx -V  //show version of cli.
```

### create mvc project

```shell
  mvx new app_name  #your application name.

```

### run mvc appliction

```shell
mvx run  ##default src/app.ts
mvx run src/app.ts

##or
tsdi run src/app.ts
```

### build pack

```shell
mvx build [--deploy]
#or
tsdi build
```

### Unit test

```shell
mvx test [test/**/*.(ts|js)]
#or
tsdi test
```

## Documentation


create application

```ts
import { AuthorizationPointcut, MvcApplication, DefaultMvcMiddlewares, MvcModule, MvcServer } from '@mvx/mvc';
import { ModelModule } from '@mvx/model';
// for typeorm model import TypeOrmModule
import { TypeOrmModule }  from '@tsdi/typeorm-adapter';


// 1. use MvcApplication to boot application.
MvcApplication.run();

// 2. use MvcApplication module to boot application

@MvcModule({
    // baseURL: __dirname,
    imports: [
        ModelModule, // your orm module adapter,
        // TypeOrmModule, // for typeorm model
        //...  you service, or controller, some extends module.
    ],
    debug: true
})
class MvcApi {
    constructor() {
        console.log('boot application');
    }
}

MvcApplication.run({module: MvcApi, ...});


// 3. use MvcApplication to boot application module.

@MvcModule({
    imports: [
        // ModelModule, // your orm module adapter
        TypeOrmModule, // for typeorm model
        // ... /...  you service, or controller, some extends module.
        // DebugLogAspect
    ],
    middlewares: DefaultMvcMiddlewares,
    // bootstrap: MvcServer
})
class MvcApi {

}

MvcApplication.run(MvcApi);


//4. use module static main to boot application by main.
@MvcModule({
    imports: [
        ModelModule, // your orm module adapter
        // ...
    ],
    // bootstrap: MvcServer,
    debug: true
})
class MvcApi {
    constructor() {
        console.log('boot application');
    }

    static main() {
        console.log('run mvc api...');
        MvcApplication.run(MvcApi);
    }
}


```



### Define Middlewares

default setting load middlewares in your project folder
`/middlewares`

```ts

import { Middleware, IMiddleware, IContext, MvcMiddleware, ForbiddenError } from '@mvx/mvc';
import { IContainer, Injectable } from '@tsdi/core';


@Middleware({
    name: 'log-test',
    after: MiddlewareTypes.BodyParser
})
export class Logger implements IMiddleware {

    constructor() {

    }

    async execute (ctx, next) {
        let start = Date.now();
        await next();
        const ms = Date.now() - start;
        console.log(`mylog: ${ctx.method} ${ctx.url} - ${ms}ms`);
        let end = new Date();
    }

}


@Middleware({ name: 'rightCheck', scope: 'route' })
export class RoleRightCheck extends MvcMiddleware {

    async execute(ctx: IContext, next: () => Promise<void>): Promise<void> {
        // let user = ctx.session.user;
        // todo check user right;
        console.log('check user right.......');
        let hasRight = true;
        if (hasRight) {
            await next();
        } else {
            throw new ForbiddenError();
        }
    }
}


```


### Auth use `@Authorization` pointcut

* aop pointcut to to dynamic check the controller with `@Authorization` decorator, use your custom auth validation. eg.

```ts
@Aspect
export class YourSecrityAspect {
    // before AuthorizationAspect.authProcess check some.
    @Before(AuthorizationPointcut, 'authAnnotation')
    sessionCheck(authAnnotation: AuthorizationMetadata[], joinPoint: Joinpoint) {
        //TODO： you check by authAnnotation
    }
}

```
### Define Controller

default setting load controllers in your project folder
`/controllers`

 * Each Controller action should return type `ResultValue`, also you can return base type or object, it deal with JsonResult.
 * The action can be `async` or `sync`. Have provide `FileResult`, `JsonResult`,
`RedirectResult`, `ViewResult` or mvc Middleware.
 * Also, you can extend with `BaseController`, it has implements some mothod to create the `ResultValue` types.
 * Model can auto create in action, it auto load value from request body.
 * Restfull params or Query String params can auto set to Controller action(Controller method) via the name of param matched. 
 * Cors by `@Cors` decorator in class or method.
 * Your can set some special middlewares for route via decorator: `@Controller`, `@Put`, `@Post`, `@Get`, `@Delete`, `@Patch`, `@Head`, `@Route`.


define as:

```ts
import { Controller, Get, Post, IContext, ContextToken,  RequestMethod, Model, Field, Cors } from '@mvx/mvc';
import { Inject } from '@tsdi/core';
import { Mywork } from '../bi/Mywork';
import { User } from '../models';

@Cors
// @Authorization()
@Controller('/users')
export class UserController {

    // @Inject(ContextToken)
    // context: IContext;
    constructor(private work: Mywork) {

    }

    @Get('')
    index() {
        console.log('home index invorked', this.work);
        return this.work.workA();
    }

    @Authorization()
    // @Cors([RequestMethod.Post])
    @Post('/add', ['your-auth-middleware', 'rightCheck'])
    async addUser(user: User, @Inject(ContextToken) ctx: IContext) {
        console.log('user:', user);
        console.log('request body', ctx.request.body);
        return this.work.save(user);
    }

    @Get('/sub')
    sub() {
        return this.work.workB();
    }

    @Cors
    // @Authorization()
    @Get('/:name')
    getPerson(name: string) {
        return this.work.find(name);
    }

    @Get('/find/:name')
    find(@Inject(ContextToken) ctx, name: string) {
        console.log(ctx);
        return this.work.find(name);
    }

    // match request query param name.
    @Get('/query')
    query(key: string, role: string, age?: number) {
        return { key: key, age: age, role: role }
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

    @Post('/posttest/:id', ['rightAuth'])
    postTest(id: number) {
        return {
            id: id
        }
    }
}



@Controller('/')
export class HomeController extends BaseController {

    // @Inject(ContextToken)
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

// with typeorm
@EntityRepository(Production)
export class ProductionRepository extends Repository<Production> {

  async findById(id: string) {
    return await this.findOne(id);
  }

  async removeById(id: string) {
    const pdtline = await this.findOne(id);
    return await this.remove(pdtline);
  }

  async serarch(...args) {
      // do sth..
  }
  ...
}

@Cors
@Authorization()
@Controller('/api/production')
export class ProductionController {


    @AutoWired() // or @Inject()
    protected rep: ProductionRepository;

    @Post('/')
    @Put('/')
    async save(pdt: Production) {
        const r = await this.rep.save(pdt);
        return ResponseResult.success(r);
    }

    @Delete('/:id')
    async removeById(id: string) {
        const r = await this.rep.removeById(id);
        return ResponseResult.success(r);
    }

    @Get('/:id')
    async get(id: string) {
        const pdtline = await this.rep.findById(id);
        return ResponseResult.success(pdtline);
    }

    @Get('/')
    async query(keywords?: string, skip?: number, take?: number) {
        const r = await this.rep.search(keywords, skip, take);
        return ResponseResult.success(r[0], r[1]);
    }
}


```


### startup Service 

imports class extends `StartupService`, will startup and configure services when application bootstarp.
socket.io sample.

```ts
@Singleton
export class RealtimeService extends StartupService<MvcContext> {

    io: Server;

    @Inject(RootMessageQueueToken)
    queue: MessageQueue<MessageContext>;


    async configureService(ctx: MvcContext): Promise<void> {
        // get configuration of mvc application.  to set your service by configuration.
        const configure = ctx.getConfiguration();
        // get logger of mvc application.
        let logger = ctx.getLogManager().getLogger();
        logger.info('create socket server...');
        this.io = SockerServer(ctx.httpServer);
        this.io.on('connection', sock => {
            logger.info('socket client connected', sock.id);
            // revice message from client. send to message queue bus.
            sock.on('your-msg', (data)=> {
                this.queue.send({
                    event: 'your-msg',
                    type: 'client',
                    data: data,
                    contexts: [{ provide: 'CLIENT', useValue: sock }]
                })
            })
        });

        // msg queue send mssage to client.
        this.queue.done(ctx => {
            if (ctx.hasValue(CLIENT_MSG) && ctx.hasValue(CLIENT_DATA)) {
                if(ctx.hasValue(CLIENT)){
                    ctx.getValue(CLIENT).emit(ctx.getValue(CLIENT_MSG), ctx.getValue(CLIENT_DATA));
                } else {
                    this.io.emit(ctx.getValue(CLIENT_MSG), ctx.getValue(CLIENT_DATA));
                }
            }
        });
    }

    protected destroying() {
        this.io.close();
    }
}

```


```ts
import { IdentityModule } from '@mvx/identity';
import { TypeOrmModule }  from '@tsdi/typeorm-adapter'; 

@MvcModule({
    // port: 8000,
    imports: [
        // 认证模块
        IdentityModule,
        // orm 模块 （基于typeorm）
        TypeOrmModule
    ],
    providers:[
        RealtimeService
    ]
    // middlewares: DefaultMvcMiddlewares,
    // debug: true
})
class MvcApp {
    constructor() {
        console.log('boot application');
    }

    // static main() {
    //     console.log('run mvc api...');
    //     MvcApplication.run(MvcApp);
    // }
}

MvcApplication.run(MvcApp);

```


### configuration

* default use config file `./config.ts` or `./config.js`.
```ts

/**
 * Configuration.
 *
 * Mvc applaction configuration.
 *
 * @export
 * @interface IConfiguration
 * @extends {ObjectMap}
 */
export interface MvcConfiguration extends RunnableConfigure {
    /**
     * cookies keys
     *
     * @type {(Keygrip | string[])}
     * @memberof IConfiguration
     */
    keys?: Keygrip | string[];
    /**
     * https server options.
     *
     * @type {ServerOptions}
     * @memberof IConfiguration
     */
    httpsOptions?: ServerOptions;
    /**
     * server hostname
     *
     * @type {string}
     * @memberof IConfiguration
     */
    hostname?: string;
    /**
     * server port.
     *
     * @type {number}
     * @memberof IConfiguration
     */
    port?: number;
    /**
     * session config.
     *
     * @type {SessionConfig}
     * @memberof IConfiguration
     */
    session?: SessionConfig;
    /**
     * contents path of files, static files. default in 'public'
     *
     * @type {(string | string[])}
     * @memberof Configuration
     */
    contents?: string[];
    /**
     * web site base url path. route prefix.
     *
     * @type {string}
     * @memberOf Configuration
     */
    routePrefix?: string;
    /**
     * sub sites.
     *
     * @type {SubSite[]}
     * @memberof IConfiguration
     */
    subSites?: SubSite[];
    /**
     * custom config key value setting.
     *
     * @type {ObjectMap}
     * @memberOf Configuration
     */
    setting?: ObjectMap;
    /**
     * db config connections.
     *
     * @type {IConnectionOptions}
     * @memberof Configuration
     */
    connections?: IConnectionOptions;
    /**
     * global cors default options.
     *
     * @type {CorsOptions}
     * @memberof Configuration
     */
    corsOptions?: CorsOptions;
    /**
     * auto load middlewares match. default `[./middlewares\/**\/*{.js,.ts}, , '!./\**\/*.d.ts']` in your project..
     *
     * @type {(string | string[])}
     * @memberOf Configuration
     */
    loadMiddlewares?: string | string[];
    /**
     * auto load controllers match. default `[./controllers\/**\/*{.js,.ts}, , '!./\**\/*.d.ts']` in your project..
     *
     * @type {(string | string[])}
     * @memberOf Configuration
     */
    loadControllers?: string | string[];
    /**
     * aspect service path. default: './aop'
     *
     * @type {(string | string[])}
     * @memberof IConfiguration
     */
    aop?: string | string[];
    /**
     * used aops.
     *
     * @type {Type[]}
     * @memberof IConfiguration
     */
    usedAops?: Type[];
    /**
     * views folder, default `./views` in your project.
     *
     * @memberof Configuration
     */
    views?: string;
    /**
     * render view options.
     *
     * @memberof Configuration
     */
    viewsOptions?: IViewOptions;
    /**
     * models match. default `['.\/models\/**\/*{.js,.ts}', '!.\/**\/*.d.ts']` in your project..
     *
     * @type {(string[] | Type[])}
     * @memberOf Configuration
     */
    models?: string[] | Type[];

    /**
     * repositories of orm. default `['.\/repositories\/**\/*{.js,.ts}', '!.\/**\/*.d.ts']` 
     */
    repositories?: string[] | Type[];
    /**
     * in debug log. defult false.
     *
     * @memberof IConfiguration
     */
    debug?: boolean;
    /**
     * log config
     *
     * @type {(LogConfigure | Type<LogConfigure>)}
     * @memberof IConfiguration
     */
    logConfig?: LogConfigure | Type<LogConfigure>;
}

/**
 * Configuration
 *
 * @export
 * @interface IConfiguration
 * @extends {MvcConfiguration}
 */
export interface IConfiguration extends MvcConfiguration  {

}

```

### Define Model

* third ORM Model:  register yourself module parser extends `ModelParser`.
* typeorm model use : [`@tsdi/typeorm-adapter`](https://www.npmjs.com/package/@tsdi/typeorm-adapter)

* default load module in `./models` folder, with exp `['.\/models\/**\/*{.js,.ts}', '!.\/**\/*.d.ts']`
* default load repositories in `./repositories` folder, with exp `['.\/repositories\/**\/*{.js,.ts}', '!.\/**\/*.d.ts']`  


```ts
import { Model, Field } from '@mvx/mvc';

@Model
export class User {
    @Field
    name: string;
    @Field
    sex: string;
    @Field
    age: number;
}

@Model
export class AccountUser extends User {
    @Field
    account: string;
    @Field
    passwd: string;
}

@Model
export class ShoppingCart{
    @Field
    owner: User;
    ....
}
```

### Define AOP

Auto load Aspect service from folder `/aop` in  your project.

see simple demo

```ts
import { Aspect, Around, Joinpoint, Before } from '@tsdi/aop';

@Aspect
export class DebugLog {
    @Around('execution(*Controller.*)')
    log(joinPoint: Joinpoint) {
        console.log('aspect append log, method name:', joinPoint.fullName, ' state:', joinPoint.state, ' Args:', joinPoint.args ,  ' returning:', joinPoint.returning, ' throwing:', joinPoint.throwing);
    }

    @Before(/Controller.\*$/)
    Beforlog(joinPoint: Joinpoint) {
        console.log('aspect Befor log:', joinPoint.fullName);
    }
}


```

## Simples

[see simples](https://github.com/zhouhoujun/type-mvc/tree/master/packages/simples)

## Documentation
Documentation is available on the
* [@mvx/cli document](https://github.com/zhouhoujun/type-mvc/tree/master/packages/cli).
* [@mvx/mvc document](https://github.com/zhouhoujun/type-mvc/tree/master/packages/mvc).
* [@mvx/identity document](https://github.com/zhouhoujun/type-mvc/tree/master/packages/identity).
* [@tsdi/ioc document](https://github.com/zhouhoujun/tsioc/tree/master/packages/ioc).
* [@tsdi/aop document](https://github.com/zhouhoujun/tsioc/tree/master/packages/aop).
* [@tsdi/core document](https://github.com/zhouhoujun/tsioc/tree/master/packages/core).
* [@tsdi/boot document](https://github.com/zhouhoujun/tsioc/tree/master/packages/boot).
* [@tsdi/components document](https://github.com/zhouhoujun/tsioc/tree/master/packages/components).
* [@tsdi/activities document](https://github.com/zhouhoujun/tsioc/tree/master/packages/activities).
* [@tsdi/typeorm-adapter document](https://github.com/zhouhoujun/tsioc/tree/master/packages/typeorm-adapter).
* [@tsdi/unit document](https://github.com/zhouhoujun/tsioc/tree/master/packages/unit).
* [@tsdi/unit-console document](https://github.com/zhouhoujun/tsioc/tree/master/packages/unit-console).
* [@tsdi/cli document](https://github.com/zhouhoujun/tsioc/tree/master/packages/cli).


## License

MIT © [Houjun](https://github.com/zhouhoujun/)