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

## License

MIT © [Houjun](https://github.com/zhouhoujun/)
