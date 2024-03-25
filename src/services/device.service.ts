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

  public async getDevice(type:string): Promise<any> {
    return this.configService.get(`device.${type}`);

    // let devices = await webusb.requestDevice({ filters: [{}] })

    // // console.log(devices)
    // let devices = await SerialPort.list();
    // return devices.map((device: any) => {
    //   return { name: device.friendlyName, port: device.path }
    // })
    
    // return this.configService.get("device.");
  }

  public async getSystemDevices(): Promise<any> {
    let devices = await SerialPort.list();
    return devices.map((device: any) => {
      return { name: device.friendlyName, port: device.path }
    })
  }

  public async setScanner(type: string, scanner: any): Promise<PortInfo[]> {
    this.configService.set(`device.${type}.${scanner.name}`, scanner)
    
    return SerialPort.list();
  }
}
