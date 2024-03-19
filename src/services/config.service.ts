import { injectable } from 'inversify';
import path from "path"
import nconf from 'nconf';

@injectable()
export class ConfigService {
  constructor() {
    const configFilePath = path.join(process.cwd(), 'default.json');

    nconf.file({ file: configFilePath });

    nconf.defaults({
      nfc: false
    });

  }

  public get(pattern?: string): any {
    let configs = nconf.get()
    const deviceKeys = Object.keys(configs).filter(key => key.startsWith(pattern));
    const devices = deviceKeys.map(key => configs[key]);
    return (devices.length == 1 ? devices[0] : devices);
  }

  public set(key: string, value: any) {
    nconf.set(key, value)
    nconf.save((err) => {
      console.log("Configuration saved")
    })
  }
}
