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
  constructor(@inject(ConfigService.name)
  private configService: ConfigService) { }

  public async getPrinters(): Promise<Printer[]> {
    return getPrinters();
  }

  public async setPrinter(type: string, name: string): Promise<any> {
    this.configService.set(`printer.${type}`, name)
  }

  public async printTicket(document: string, printer: string) {
    return new Promise((resolve: any, reject: any) => {
      const md5Hash = crypto.createHash('md5');
      md5Hash.update(document);
      let filename = md5Hash.digest('hex');

      let tempFile = path.join(os.tmpdir(), filename);

      let options = {
        width: 220,
      };

      let file = { content: document };
      html_to_pdf
        .generatePdf(file, options)
        .then((pdfBuffer) => {
          fs.writeFileSync(tempFile, pdfBuffer);
          console.log(tempFile)
          print(tempFile, { printer: printer })
            .then((data: any) => {
              resolve(data);
            })
            .catch(console.log)
            .finally(() => {
              // fs.unlinkSync(tempFile);
            });
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }
}
