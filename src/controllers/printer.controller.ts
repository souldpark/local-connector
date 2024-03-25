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
import { LogService } from '../services/log.service';

@controller('/printer')
export class PrinterController implements interfaces.Controller {
  constructor(
    @inject(PrinterService.name)
    private printService: PrinterService,
    @inject(LogService.name)
    private logService: LogService
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
    try {
      let printers = await this.printService.getPrinters();

      response.status(status.OK).send(printers);
    } catch (error) {
      this.logService.error(error)
      response.status(status.INTERNAL_SERVER_ERROR).send(error);
    }
  }

  @httpPost('/')
  public async setPrinter(
    @request() request: Request,
    @response() response: Response,
    @next() next: NextFunction
  ): Promise<void> {
    try {
      await this.printService.setPrinter(request.body.type, request.body.name);

      response.status(status.NO_CONTENT).send();
    } catch (error) {
      this.logService.error(error)
      response.status(status.INTERNAL_SERVER_ERROR).send(error);
    }
  }

  @httpPost('/preview')
  public async preview(
    @request() request: Request,
    @response() response: Response,
    @next() next: NextFunction
  ): Promise<void> {
    try {
      let pdf = await this.printService
        .generateTicket(Buffer.from(request.body.document, 'base64').toString('utf8'))

      response.status(status.OK).send({ filename: pdf });
    } catch (error) {
      this.logService.error(error)
      response.status(status.INTERNAL_SERVER_ERROR).send(error);
    }
  }

  @httpPost('/print')
  public async print(
    @request() request: Request,
    @response() response: Response,
    @next() next: NextFunction,
  ): Promise<void> {
    try {
      let data = await this.printService
        .printTicket(request.body.document)
      response.status(status.OK).send(data);
    } catch (error) {
      this.logService.error(error)
      response.status(status.INTERNAL_SERVER_ERROR).send({ "message": error });
    }
  }
}
