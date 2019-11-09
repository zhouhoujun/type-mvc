# packaged @mvx/cli
`@mvx/cli` is mvc cli, base on AOP, Ioc container, via @tsdi. file stream pipes activities.



## Install


install cli

### cli in global
```shell
npm install -g '@mvx/cli'
```

```
  mvx --help  //show help
  mvx -V  //show version of cli.
```

### create mvc project
```
  mvx new projectname

```
### run mvc appliction
```
mvx run

//or
tsdi run src/app.ts
```

### build pack
```
mvx build [--deploy]
```

### Unit test

```shell
mvx test [test/**/*.(ts|js)]
```



## License

MIT © [Houjun](https://github.com/zhouhoujun/)