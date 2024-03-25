import { inject, injectable } from 'inversify';
import { SerialPort } from 'serialport'
import { ConfigService } from './config.service';
import { SocketService } from './socket.service';
import { NFC, TAG_ISO_14443_3, KEY_TYPE_A } from 'nfc-pcsc';
import { EventLogger } from 'node-windows';
import fs from "fs";

@injectable()
export class LogService {
    private log;
    constructor(
        @inject(ConfigService.name)
        private configService: ConfigService,
        @inject(SocketService.name)
        private socketService: SocketService,
    ) {
        let pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
        this.log = new EventLogger({
            source: pkg.friendlyName,
            eventLog: 'APPLICATION'
        });
    }

    public info(message: string) {
        this.log.info(message);
    }

    public warn(message: string) {
        this.log.warn(message);
    }

    public error(message: string) {
        this.log.error(message);
    }
}