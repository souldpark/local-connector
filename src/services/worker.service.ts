import { inject, injectable } from 'inversify';
import { SerialPort } from 'serialport'
import { ConfigService } from './config.service';
import { SocketService } from './socket.service';
import { NFC, TAG_ISO_14443_3, KEY_TYPE_A } from 'nfc-pcsc';

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

    decodeATR(atrBuffer) {
        const atr = {
            ts: atrBuffer[0], // Initial character (TS)
            t0: atrBuffer[1], // Format byte (T0)
            historicalBytes: [], // Historical bytes (optional)
        };

        // If there are historical bytes (T0 indicates so), extract them
        if (atr.t0 & 0x10) {
            const historicalLength = atrBuffer[atrBuffer.length - 1];
            atr.historicalBytes = atrBuffer.slice(2, 2 + historicalLength);
        }
        console.log(atr)
        return atr;
    }

    public async initializeNFC() {
        // const response = {
        //     atr: Buffer.from([0x3b, 0x8f, 0x80, 0x01, 0x80, 0x4f, 0x0c, 0xa0, 0x00, 0x00, 0x03, 0x06, 0x03, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x6a]),
        //     standard: 'TAG_ISO_14443_3',
        //     type: 'TAG_ISO_14443_3',
        //     uid: 'f7eea4c3'
        //   };

        //   const atrString = response.atr.toString('hex'); // Convert buffer to hexadecimal string
        //   console.log(atrString);

        // let deviceNfc = this.configService.get("device.nfc")
        // console.log(deviceNfc)
        // if (deviceNfc) {
        const nfc = new NFC();

        nfc.on('reader', reader => {
            reader.autoProcessing = false;

            reader.on('card', async card => {
                if (card.type === TAG_ISO_14443_3) {
                    const key = 'FFFFFFFFFFFF';
                    const keyType = KEY_TYPE_A;
                    const sector = 5
                    try {
                        await reader.authenticate(sector, keyType, key);

                        const data = await reader.read(sector, 16, 16);

                        const cardNumber = Buffer.from(data.slice(0, 14), 'hex').toString('utf8');

                        this.socketService.emit('card-scanned', cardNumber)

                        //SECTOR 3: 000000000000ff078069ffffffffffff
                        //SECTOR 4: 5a38374150504b3550394c4400000000
                        //SECTOR 5: 31323939383039320000000000000000
                        //SECTOR 7: 000000000000ff078069ffffffffffff
                        //11 000000000000ff078069ffffffffffff
                        //15 000000000000ff078069ffffffffffff
                        // Print the data
                        // console.log(`Data from ${reader.reader.name}:`, data.toString('hex'));
                    } catch (err) {
                        console.error(`Error when reading card`, err);
                    }
                }
            });

            reader.on('card.off', card => {
                // console.log(`${reader.reader.name}  card removed`, card);
            });

            reader.on('error', err => {
                console.log(`${reader.reader.name}  an error occurred`, err);
            });

            reader.on('end', () => {
                // console.log(`${reader.reader.name}  device removed`);
            });

        });

        nfc.on('error', err => {
            console.log('an error occurred', err);
        });
    }
    // }
}