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
import { DeviceService } from '../services/device.service';
import { ConfigService } from '../services/config.service';
import { SocketService } from '../services/socket.service';
import { LogService } from '../services/log.service';

@controller('/config')
export class ConfigurationController implements interfaces.Controller {
  constructor(
    @inject(ConfigService.name)
    private configService: ConfigService,
    @inject(SocketService.name)
    private socketService: SocketService,
    @inject(LogService.name)
    private logService: LogService
  ) { }

  // @httpPost('/pos')
  // public async setPos(
  //   @request() request: Request,
  //   @response() response: Response,
  //   @next() next: NextFunction,
  // ): Promise<void> {
  //   try {
  //     this.configService.set(`info.pos`, request.body.pos)

  //     this.socketService.emit("local-connect", { pos: request.body.pos })

  //     response.status(status.NO_CONTENT).send();
  //   } catch (error: any) {
  //     this.logService.error(error)
  //     response.status(status.INTERNAL_SERVER_ERROR).send(error);
  //   }
  // }

  @httpGet('/:type')
  public async get(
    @request() request: Request,
    @response() response: Response,
    @next() next: NextFunction,
    @requestParam('type') type: string
  ): Promise<void> {
    try {
      let config = this.configService.get(type);

      response.status(status.OK).send(config);
    } catch (error: any) {
      this.logService.error(error)
      response.status(status.INTERNAL_SERVER_ERROR).send(error);
    }
  }

  @httpPost('/:type')
  public async set(
    @request() request: Request,
    @response() response: Response,
    @next() next: NextFunction,
    @requestParam('type') type: string
  ): Promise<void> {
    try {
      this.configService.set(type, request.body);

      this.socketService.emit(`set-${type}`, { printer: request.body })

      response.status(status.NO_CONTENT).send();
    } catch (error: any) {
      this.logService.error(error)
      response.status(status.INTERNAL_SERVER_ERROR).send(error);
    }
  }

  // @httpPost('/printer')
  // public async setPrinter(
  //   @request() request: Request,
  //   @response() response: Response,
  //   @next() next: NextFunction,
  // ): Promise<void> {
  //   try {
  //     this.configService.set("device.printer", request.body.printer);

  //     this.socketService.emit("printer/selected", { printer: request.body.printer })

  //     response.status(status.NO_CONTENT).send();
  //   } catch (error: any) {
  //     this.logService.error(error)
  //     response.status(status.INTERNAL_SERVER_ERROR).send(error);
  //   }
  // }
}
