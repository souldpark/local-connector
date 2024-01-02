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

@controller('/health')
export class HealthController implements interfaces.Controller {
  constructor() {}

  @httpGet('')
  public async status(
    @request() request: Request,
    @response() response: Response,
    @next() next: NextFunction,
  ): Promise<void> {
    response.status(status.OK).send();
  }
}
