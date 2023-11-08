import { inject, injectable } from 'inversify';
import { Server, Socket } from 'socket.io';
import { CashierService } from './cashier.service';

@injectable()
export class SocketService {
    private socketInstance: Server | null = null;

    constructor(@inject(CashierService.name)
    private cashierService: CashierService) {

    }

    public async init(httpsServer: any) {
        this.socketInstance = new Server(httpsServer, {
            cors: {
                origin: '*',
            },
        });

        this.socketInstance.on('connection', (socket: Socket) => {
            console.log('A user connected.');

            const posToken = this.cashierService.getToken();
            console.log(posToken)
            this.emit("pos-signin", posToken)
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