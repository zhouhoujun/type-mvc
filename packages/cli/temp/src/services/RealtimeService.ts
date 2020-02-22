import { Server, Socket } from 'socket.io';
import * as SockerServer from 'socket.io';
import { MvcContext } from '@mvx/mvc';
import { Inject, Singleton } from '@tsdi/ioc';
import { MessageQueue, RootMessageQueueToken, MessageContext, StartupService } from '@tsdi/boot';

@Singleton
export class RealtimeService extends StartupService<MvcContext> {

    io: Server;

    @Inject(RootMessageQueueToken)
    queue: MessageQueue<MessageContext>;

    async configureService(ctx: MvcContext): Promise<void> {
        let logger = ctx.getLogManager().getLogger();
        logger.info('create socket server...');
        this.io = SockerServer(ctx.httpServer);
        this.io.on('connection', sock => {
            logger.info('socket client connected', sock.id);
        });
    }

}
