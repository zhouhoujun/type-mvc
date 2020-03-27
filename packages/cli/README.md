# packaged @mvx/cli
`@mvx/cli` is mvc cli, base on AOP, Ioc container, via @tsdi. file stream pipes activities.

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
```

### Unit test

```shell
mvx test [test/**/*.(ts|js)]
```

### packages
[@mvx/cli](https://www.npmjs.com/package/@mvx/cli)
[@mvx/mvc](https://www.npmjs.com/package/@mvx/mvc)
[@tsdi/identity](https://www.npmjs.com/package/@mvx/identity)

[@tsdi/cli](https://www.npmjs.com/package/@tsdi/cli)
[@tsdi/ioc](https://www.npmjs.com/package/@tsdi/ioc)
[@tsdi/aop](https://www.npmjs.com/package/@tsdi/aop)
[@tsdi/core](https://www.npmjs.com/package/@tsdi/core)
[@tsdi/boot](https://www.npmjs.com/package/@tsdi/boot)
[@tsdi/components](https://www.npmjs.com/package/@tsdi/components)
[@tsdi/compiler](https://www.npmjs.com/package/@tsdi/compiler)
[@tsdi/activities](https://www.npmjs.com/package/@tsdi/activities)
[@tsdi/pack](https://www.npmjs.com/package/@tsdi/pack)
[@tsdi/typeorm-adapter](https://www.npmjs.com/package/@tsdi/typeorm-adapter)
[@tsdi/unit](https://www.npmjs.com/package/@tsdi/unit)
[@tsdi/unit-console](https://www.npmjs.com/package/@tsdi/unit-console)

## License

MIT © [Houjun](https://github.com/zhouhoujun/)
