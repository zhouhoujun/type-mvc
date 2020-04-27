import { Server, Socket } from 'socket.io';
import * as SockerServer from 'socket.io';
import { Inject, Singleton, tokenId } from '@tsdi/ioc';
import { MvcContext } from '@mvx/mvc';
import { MessageQueue, RootMessageQueueToken, MessageContext, StartupService } from '@tsdi/boot';
import { ILogger } from '@tsdi/logs';
import { UserRepository } from '../repositories/UserRepository';

/**
 * send client message.
 */
export const CLIENT_MSG = tokenId<string>('CLIENT_MSG');
/**
 * send client data.
 */
export const CLIENT_DATA = tokenId<any>('CLIENT_DATA');

export const CLIENT_SOCKET = tokenId<Socket>('CLIENT_SOCKET');

@Singleton
export class RealtimeService extends StartupService<MvcContext> {

    io: Server;

    @Inject(RootMessageQueueToken)
    queue: MessageQueue<MessageContext>;

    @Inject()
    rep: UserRepository;

    private logger: ILogger;

    async configureService(ctx: MvcContext): Promise<void> {
        const logger = this.logger = ctx.getLogManager().getLogger();
        logger.info('create socket server...');
        this.io = SockerServer(ctx.httpServer);

        this.io.on('connection', (sock: Socket) => {
            logger.info('socket client connected', sock.id);

            sock.on('msg', (data) => {
                this.queue.send({
                    event: 'your-msg',
                    type: 'client',
                    data: data,
                    contexts: [{ provide: CLIENT_SOCKET, useValue: sock }]
                });
            });
        });

        // after handle msg.
        this.queue.done(ctx => {
            if (ctx.hasValue(CLIENT_MSG) && ctx.hasValue(CLIENT_DATA)) {
                // responent
                ctx.getValue(CLIENT_SOCKET)?.emit(ctx.getValue(CLIENT_MSG), ctx.getValue(CLIENT_DATA));
                // boadcast
                this.io.emit(ctx.getValue(CLIENT_MSG), ctx.getValue(CLIENT_DATA));
            }
        });
    }

    protected destroying() {
        this.logger.info('shutdown socket server');
        this.io.close();
    }
}
