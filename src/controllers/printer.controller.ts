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

@controller('/printer')
export class PrinterController implements interfaces.Controller {
  constructor(
    @inject(PrinterService.name)
    private printService: PrinterService
  ) {
  }

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

  @httpPost('/')
  public async setPrinter(
    @request() request: Request,
    @response() response: Response,
    @next() next: NextFunction
  ): Promise<void> {
    await this.printService.setPrinter(request.body.type, request.body.name);

    response.status(status.NO_CONTENT).send();
  }

  @httpPost('/preview')
  public async preview(
    @request() request: Request,
    @response() response: Response,
    @next() next: NextFunction
  ): Promise<void> {
    let pdf = await this.printService
      .generateTicket(Buffer.from(request.body.document, 'base64').toString('utf8'))

    response.status(status.OK).send({ filename: pdf });
  }

  @httpPost('/print')
  public async print(
    @request() request: Request,
    @response() response: Response,
    @next() next: NextFunction,
  ): Promise<void> {
    return this.printService
      .printTicket(request.body.document)
      .then((data: any) => {
        response.status(status.OK).send(data);
      }).catch((error: any) => {
        response.status(status.INTERNAL_SERVER_ERROR).send({ "message": error });
      });
  }
}
