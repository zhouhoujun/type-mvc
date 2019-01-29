// import { ConfigureRegister } from '@ts-ioc/bootstrap';
// import { DebugLogAspect } from '@ts-ioc/logs';
// import { Singleton } from '@ts-ioc/core';
// import { IConfiguration } from './IConfiguration';

// @Singleton
// export class MvcConfigureRegister extends ConfigureRegister<IConfiguration> {
//     constructor() {
//         super();
//     }
//     async register(config: IConfiguration): Promise<void> {
//         if (config.debug) {
//             this.container.register(DebugLogAspect);
//         }

//         if (config.controllers) {
//             await this.container.loadModule({ files: config.controllers });
//         }
//         if (config.middlewares) {
//             await this.container.loadModule({ files: config.middlewares });
//         }
//         if (config.aop) {
//             await this.container.loadModule({ files: config.aop });
//         }
//     }
// }
