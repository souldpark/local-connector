import { inject, injectable } from 'inversify';
import { Server, Socket } from 'socket.io';
import { ConfigService } from './config.service';

@injectable()
export class SocketService {
    private socketInstance: Server | null = null;

    constructor(
        @inject(ConfigService.name)
        private configService: ConfigService,
    ) {

    }

    public async init(httpsServer: any) {
        this.socketInstance = new Server(httpsServer, {
            cors: {
                origin: '*',
            },
        });

        this.socketInstance.on('connection', (socket: Socket) => {
            console.log('A user connected.');

            this.emit("set-pos", this.configService.get("pos"))

            socket.on('disconnect', () => {
                console.log('A user disconnected.');
            });
        });
    }

    public emit(ev: string, obj: any) {
        this.socketInstance.emit(ev, obj)
    }

    public subscribe(ev: string, listener: any) {
        this.socketInstance.on(ev, listener)
    }
}