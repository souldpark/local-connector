import {
  controller,
  httpGet,
  httpPost,
  interfaces,
  queryParam,
  requestParam,
  next,
  request,
  response,
} from 'inversify-express-utils';
import { inject } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import { PrinterService } from '../services/printer.service';
import fs from "fs";
import { render } from "mustache";

@controller('/printer')
export class PrinterController implements interfaces.Controller {
  constructor(
    @inject(PrinterService.name)
    private printService: PrinterService
  ) { }

  @httpGet('/list')
  public async list(
    @queryParam('pageNumber') pageNumber: number,
    @queryParam('pageSize') pageSize: number,
    @request() request: Request,
    @response() response: Response,
    @next() next: NextFunction
  ): Promise<void> {
    let printers = await this.printService.getPrinters();

    response.status(status.OK).send(printers);
  }

  @httpPost('/:printer/print')
  public async print(
    @request() request: Request,
    @response() response: Response,
    @next() next: NextFunction,
    @requestParam('printer') printer: string
  ): Promise<void> {

    let tmpContent = fs.readFileSync(`${__dirname}/../templates/ticket.mustache`, 'utf8');

    var htmlContent = render(tmpContent, request.body);

    return this.printService
      .printTicket(htmlContent, printer)
      .then((data: any) => {
        response.status(status.OK).send(data);
      });
  }
}
