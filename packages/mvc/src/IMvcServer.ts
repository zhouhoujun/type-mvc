import { IService } from '@tsdi/boot';
import { IConfiguration } from './IConfiguration';
import { Router } from './router/Router';
import { Server } from 'net';

export interface IMvcServer extends IService {
    uri: string;
    port: number;
    hostname: string;
    getConfig(): IConfiguration;
    getRouter(): Router;
    getHttpServer(): Server
}
