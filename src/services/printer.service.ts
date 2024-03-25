import { inject, injectable } from 'inversify';
import { ConfigService } from './config.service';
import crypto from 'crypto';
import { print, getPrinters, Printer, getDefaultPrinter } from 'pdf-to-printer';
import fs from 'fs';
import html_to_pdf from 'html-pdf-node';
import os from 'os';
import path from 'path';

@injectable()
export class PrinterService {
  private defaultPrinter = "";
  constructor(@inject(ConfigService.name)
  private configService: ConfigService) {
    getDefaultPrinter().then((def: any) => {
      this.defaultPrinter = def.deviceId;
    })
  }

  public async getPrinters(): Promise<Printer[]> {
    return getPrinters();
  }

  public async setPrinter(type: string, name: string): Promise<any> {
    this.configService.set(`printer.${type}`, name)
  }

  public async generateTicket(document: string) {
    var options = { width: 220, preferCSSPageSize: true, header: { "height": "5mm" }, footer: { "height": "5mm" }, border: { top: '30px', bottom: '30px', left: '10px' } }


    let file = { content: document };

    const md5Hash = crypto.createHash('md5');
    md5Hash.update(document);
    let filename = md5Hash.digest('hex') + ".pdf";

    let tempFile = path.join(os.tmpdir(), filename);

    let pdfBuffer = await html_to_pdf.generatePdf(file, options)

    fs.writeFileSync(tempFile, pdfBuffer);

    return filename
  }

  public async printTicket(filename: string) {
    let tempFile = path.join(os.tmpdir(), filename);

    return new Promise((resolve: any, reject: any) => {

      print(tempFile, { printer: this.defaultPrinter })
        .then((data: any) => {
          resolve(data);
        })
        .catch(console.log)
        .finally(() => {
          // fs.unlinkSync(tempFile);
        });
    })
  }
}
