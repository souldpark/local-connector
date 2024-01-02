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

  public get(key: string) {
    return nconf.get(key)
  }

  public set(key: string, value: any) {
    nconf.set(key, value)
    nconf.save();
  }
}
