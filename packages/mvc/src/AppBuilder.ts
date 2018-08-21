import { AnnotationBuilder } from '@ts-ioc/bootstrap';
import { IApplication, AppBuilderToken } from './IApplication';
import { IConfiguration } from './IConfiguration';
import { MiddlewareChainToken } from './middlewares';
import { Injectable } from '@ts-ioc/core';
import { Application } from './Application';

@Injectable(AppBuilderToken)
export class AppBuilder extends AnnotationBuilder<IApplication> {

    async buildStrategy(app: IApplication, config: IConfiguration): Promise<IApplication> {
        if (app instanceof Application) {
            let chain = this.container.get(MiddlewareChainToken);
            chain.use(...config.useMiddlewares);
            chain.setup(app);
        }
        return app;
    }
}
