import { Server } from 'net';
import { tokenId } from '@tsdi/ioc';
import { IConfiguration } from './IConfiguration';
import { MvcContext } from './MvcContext';


export type ServerFactory = (ctx: MvcContext, config: IConfiguration) => Server;

export const ServerFactoryToken = tokenId<ServerFactory>('ServerFactory');