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
  }

  public get(key: string): any {
    return nconf.get(key)
  }

  public delete(key: string): any {
    nconf.remove(key)
    nconf.save((err) => {
      console.log("Configuration saved")
    })
  }

  public set(key: string, value: any) {
    nconf.set(key, value)
    nconf.save((err) => {
      console.log("Configuration saved")
    })
  }
}
