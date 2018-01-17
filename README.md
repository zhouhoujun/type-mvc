# packaged type-mvc

This repo is for distribution on `npm`. The source for this module is in the
[main repo](https://github.com/zhouhoujun/type-mvc).

type-mvc is base on koa, with typescript.  Decorator, Ioc, AOP  MVC frameworker on server.  base on ioc [`tsioc`](https://www.npmjs.com/package/tsioc)[(type-autofac)](https://www.npmjs.com/package/type-autofac). help you develop your project easily.



## Install

You can install this package either with `npm`

### npm

```shell

npm install type-mvc

```

## Documentation

* v0.5.3

    1. fix bug in nuix linux load .d.ts file raise error, set default comfig  load module with !./**/*.d.ts exclude.

* v0.5.1 
    1. add Log aop aspect service. for Log easy.  default user console to log, can config `logLib`,`logConfig` in your `config.js` to use third logger lib. eg. `{ logLib: 'log4js', logConfig:{...} }`.
    has implements log4js adapter [see code](https://github.com/zhouhoujun/type-mvc/blob/master/src/logs/Log4jsAdapter.ts)

    2. DebugAspect, config `debug: true`,  in your `config.js`, will auto log debug info.
    2. [AnnotationLogerAspect](https://github.com/zhouhoujun/type-mvc/blob/master/src/aop/AnnotationLogerAspect.ts) @annotation(Logger), logger some state via @Logger decorator config. 
    2. add Annotation Auth aspect service [`AuthAspect`](https://github.com/zhouhoujun/type-mvc/blob/master/src/aop/AuthAspect.ts) to support yourself auth check easy. eg.
    
```ts
@Aspect
export class YourSecrityAspect {
    // before AuthAspect.auth check some.
    @Before('execution(AuthAspect.auth)', 'authAnnotation')
    sessionCheck(authAnnotation: AuthorizationMetadata[], joinPoint: Joinpoint) {
        //TODO： you check by authAnnotation
    }
}

```

* v0.4.1  fix assertUrlRegExp bug.
* v0.3.20 New Feature：
    1. Router and Cors middleware will check url is right route or not.
    add default route Url check in Configuartion.   isRouteUrl method and routeUrlRegExp field.
* v0.3.19 New Feature:
    Fix bug, reset context middleware order to fix 500 error, when some time request.
* v0.3.18 New Feature:
    1. update tsioc to improvement method invoker.
    2. fix Model not register bug. get Model return empty object.
* v0.3.17 New Feature:
    1. add hostname for http or https to listen.
* v0.3.12 New Feature:
    1. es5 support. enable config https http server.
* v0.3.10 New Feature:
    1. Restfull params or Query String params can auto set to Controller action(Controller method) via the name of param matched.


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

* third ORM Model:  Configuration ModelOptions in your config file. like:

```ts
{
    ...
    modelOptions: <ModelOptions>{
        classMetaname: 'Model Class Metadata Name',
        fieldMetaname: 'Model Filed Metadata Name',
    }
    ...
}
```

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

### Define Controller

default setting load controllers in your project folder
`/controllers`

 * Each Controller action should return type `ResultValue`, also you can return base type or object, it deal with JsonResult.
 * The action can be `async` or `sync`. Have provide `FileResult`, `JsonResult`,
`RedirectResult`, `ViewResult`.
 * Also, you can extend with `BaseController`, it has implements some mothod to create the `ResultValue` types.
 * Model can auto create in action, it auto load value from request body.
 * Restfull params or Query String params can auto set to Controller action(Controller method) via the name of param matched. 
 * Cors by `@Cors` decorator in class or method.

define as:

```ts
import { Controller, Get, Post, IContext, symbols, Model, Field, Cors } from 'type-mvc';
import { Inject } from 'tsioc';
import { Mywork } from '../bi/Mywork';
import { User } from '../models';

@Cors
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

    @Cors([RequestMethod.Post])
    // also can define as below
    // @Cors(['Post','Get'])
    // @Cors('POST,GET')
    @Post('/add')
    async addUser(user: User, @Inject(symbols.IContext) ctx: IContext) {
        console.log('user:', user);
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

### Define AOP

Auto load Aspect service from folder `/aop` in  your project.

see simple demo

```ts
import { Aspect, Around, Joinpoint, Before } from 'tsioc';

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


### Define Middlewares

default setting load middlewares in your project folder
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