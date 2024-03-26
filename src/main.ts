process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { container } from "./config/inversify.config"
import { WorkerService } from './services/worker.service';
import { LogService } from './services/log.service';

if (!process.env.NODE_ENV) {
  dotenv.config({ path: `${__dirname}/../.env` });
}

let logService = container.get<LogService>(LogService.name);

process.on('uncaughtException', function (err: Error) {
  logService.error(`Error message: ${err.message}
  Error trace: ${err.stack}`);
});

async function startServer() {
  await require('./loaders').default();

  let workerService = container.get<WorkerService>(WorkerService.name);

  workerService.initializeScanner()
  workerService.initializeNFC()
}

// installService()

startServer();