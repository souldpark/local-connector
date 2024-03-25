process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { container } from "./config/inversify.config"
import { WorkerService } from './services/worker.service';
import { LogService } from './services/log.service';

if (!process.env.NODE_ENV) {
  dotenv.config({ path: `${__dirname}/../.env` });
}

async function startServer() {
  await require('./loaders').default();

  let workerService = container.get<WorkerService>(WorkerService.name);
  
  workerService.initializeScanner()
  workerService.initializeNFC()
}

// installService()

startServer();