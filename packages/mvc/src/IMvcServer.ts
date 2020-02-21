import { IService } from '@tsdi/boot';
import { IConfiguration } from './IConfiguration';
import { Router } from './router/Router';
import * as http from 'http';
import * as https from 'https';

export interface IMvcServer extends IService {
    uri: string;
    port: number;
    hostname: string;
    getConfig(): IConfiguration;
    getRouter(): Router;
    getHttpServer(): http.Server | https.Server
}
