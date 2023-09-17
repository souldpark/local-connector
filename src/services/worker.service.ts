import { inject, injectable } from 'inversify';
import { SerialPort } from 'serialport'
import { ConfigService } from './config.service';
import { SocketService } from './socket.service';
import { NFC } from 'nfc-pcsc';

@injectable()
export class WorkerService {
    private scannerPort: SerialPort;

    constructor(
        @inject(ConfigService.name)
        private configService: ConfigService,
        @inject(SocketService.name)
        private socketService: SocketService,
    ) {

    }

    public async initializeScanner() {
        let scanner = this.configService.get("device.scanner")

        if (this.scannerPort?.isOpen) {
            this.scannerPort.close()
        }
        if (scanner) {
            this.scannerPort = this.initializePort(scanner.port, scanner.boundRate, (data: any) => {
                this.socketService.emit('card-scanned', data.toString("utf8"))
            })
        }
    }

    private initializePort(port: string, boundRate: number, onData: any) {
        const serialPort = new SerialPort({
            path: port,
            baudRate: boundRate,
        });

        serialPort.on('readable', () => {
            console.log(`[${port}] Readable Data:`, serialPort.read().toString("utf8"));
        });

        serialPort.on('data', onData);

        serialPort.on('error', (error) => {
            console.error('Serial port error:', error);
        });
        return serialPort;
    }


    public async initializeNFC() {
        const response = {
            atr: Buffer.from([0x3b, 0x8f, 0x80, 0x01, 0x80, 0x4f, 0x0c, 0xa0, 0x00, 0x00, 0x03, 0x06, 0x03, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x6a]),
            standard: 'TAG_ISO_14443_3',
            type: 'TAG_ISO_14443_3',
            uid: 'f7eea4c3'
          };
          
          const atrString = response.atr.toString('hex'); // Convert buffer to hexadecimal string
          console.log(atrString);
          
        let deviceNfc = this.configService.get("device.nfc")
        if (deviceNfc) {
            const nfc = new NFC();

            nfc.on('reader', reader => {
                console.log(`${reader.reader.name}  device attached`);

                // enable when you want to auto-process ISO 14443-4 tags (standard=TAG_ISO_14443_4)
                // when an ISO 14443-4 is detected, SELECT FILE command with the AID is issued
                // the response is available as card.data in the card event
                // see examples/basic.js line 17 for more info
                // reader.aid = 'F222222222';

                reader.on('card', card => {

                    // card is object containing following data
                    // [always] String type: TAG_ISO_14443_3 (standard nfc tags like MIFARE) or TAG_ISO_14443_4 (Android HCE and others)
                    // [always] String standard: same as type
                    // [only TAG_ISO_14443_3] String uid: tag uid
                    // [only TAG_ISO_14443_4] Buffer data: raw data from select APDU response

                    console.log(`${reader.reader.name}  card detected`, card);

                    console.log("CARD NUMBER: " + card.atr.toString('utf8'))

                });

                // reader.on('card.off', card => {
                //     console.log(`${reader.reader.name}  card removed`, card);
                // });

                reader.on('error', err => {
                    console.log(`${reader.reader.name}  an error occurred`, err);
                });

                reader.on('end', () => {
                    console.log(`${reader.reader.name}  device removed`);
                });

            });

            nfc.on('error', err => {
                console.log('an error occurred', err);
            });
        }
    }
}