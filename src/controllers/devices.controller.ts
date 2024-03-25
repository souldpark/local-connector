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
import { LogService } from '../services/log.service';

@controller('/device')
export class DeviceController implements interfaces.Controller {
  constructor(
    @inject(DeviceService.name)
    private deviceService: DeviceService,
    @inject(LogService.name)
    private logService: LogService
  ) { }

  @httpGet('/list')
  public async list(
    @request() request: Request,
    @response() response: Response,
    @next() next: NextFunction
  ): Promise<void> {
    try {
      let devices = await this.deviceService.getSystemDevices();

      response.status(status.OK).send(devices);
    } catch (error) {
      this.logService.error(error)
      response.status(status.INTERNAL_SERVER_ERROR).send(error);
    }
  }

  @httpGet('/list/:type')
  public async listType(
    @request() request: Request,
    @response() response: Response,
    @next() next: NextFunction,
    @requestParam('type') type: string
  ): Promise<void> {
    try {
      let devices = await this.deviceService.getDevice(type);

      response.status(status.OK).send(devices);
    } catch (error) {
      this.logService.error(error)
      response.status(status.INTERNAL_SERVER_ERROR).send(error);
    }
  }

  @httpPost('/:type')
  public async setScanner(
    @request() request: Request,
    @response() response: Response,
    @next() next: NextFunction,
    @requestParam('type') type: string
  ): Promise<void> {
    try {
      await this.deviceService.setScanner(type, request.body);

      response.status(status.NO_CONTENT).send();
    } catch (error: any) {
      this.logService.error(error)
      response.status(status.INTERNAL_SERVER_ERROR).send(error);
    }
  }
}
