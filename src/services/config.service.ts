import { injectable } from 'inversify';
import path from "path"
import nconf from 'nconf';
import os from "os";
import fs from "fs";;

@injectable()
export class ConfigService {
  constructor() {
    let configFilePath = path.join(os.homedir(), ".local-connector");
    if (!fs.existsSync(configFilePath)) {
      fs.mkdirSync(configFilePath, { recursive: true });
      console.log(`Folder created at ${configFilePath}`);
    } else {
      console.log(`Folder already exists at ${configFilePath}`);
    }

    configFilePath = path.join(configFilePath, 'default.json');

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
