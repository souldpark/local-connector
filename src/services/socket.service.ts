import { injectable } from 'inversify';
import { Server, Socket } from 'socket.io';

@injectable()
export class SocketService {
    private socketInstance: Server | null = null;

    constructor() {

    }

    public async init(httpsServer: any) {
        this.socketInstance = new Server(httpsServer, {
            cors: {
                origin: '*',
            },
        });

        this.socketInstance.on('connection', (socket: Socket) => {
            console.log('A user connected.');

            socket.on('disconnect', () => {
                console.log('A user disconnected.');
            });
        });
    }

    public emit(ev: string, ...args: any[]) {
        this.socketInstance.emit(ev, args)
    }

    public subscribe(ev: string, listener: any) {
        this.socketInstance.on(ev, listener)
    }
}