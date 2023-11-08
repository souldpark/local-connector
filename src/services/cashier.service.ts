import { injectable } from 'inversify';
import crypto from 'crypto';
import fs from 'fs';

@injectable()
export class CashierService {
  constructor() { }

  public getToken() {
    const publicKey = fs.readFileSync('public_key.pem', 'utf8');
    const fileName = "POS.key";

    if (fs.existsSync(fileName)) {


      const posKey = fs.readFileSync('POS.key', 'utf8');

      let obj = Buffer.from(posKey, 'base64').toString("utf-8");

      let objModel = JSON.parse(obj)


      const symKey = crypto.publicDecrypt({
        key: publicKey,
        passphrase: 'LAKfe923f9*&g'
      }, Buffer.from(objModel.key, 'base64'));

      const decipher = crypto.createDecipheriv('aes-256-cbc', symKey, Buffer.from(objModel.iv, 'base64'));
      let decryptedData = decipher.update(objModel.message, 'base64', 'utf8');
      decryptedData += decipher.final('utf8');
      console.log(decryptedData)

      return decryptedData;

    }
  }
}
