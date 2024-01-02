import { PortInfo } from '@serialport/bindings-interface';
import { inject, injectable } from 'inversify';
import { ConfigService } from './config.service';
import { SerialPort } from 'serialport';

@injectable()
export class DeviceService {

  constructor(
    @inject(ConfigService.name)
    private configService: ConfigService
  ) {
  }

  public async getDevices(): Promise<PortInfo[]> {
    // this.configService.set("asd", "ddd")
    // let devices = await webusb.requestDevice({ filters: [{}] })

    // console.log(devices)
    console.log(this.configService.get("device.*"))

    return SerialPort.list();
  }

  public async setScanner(type: string, scanner: any): Promise<PortInfo[]> {
    this.configService.set(`device.${type}`, scanner)

    return SerialPort.list();
  }
}
