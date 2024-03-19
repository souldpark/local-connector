process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { container } from "./config/inversify.config"
import { WorkerService } from './services/worker.service';

if (!process.env.NODE_ENV) {
  dotenv.config({ path: `${__dirname}/../.env` });
}

async function installService() {

  const service = {
    name: 'Local Connector Service',
    description: 'Local Connector Service',
    script: `${__dirname}/main.js`
  }

  var { Service } = require('node-windows');

  var svc = new Service(service);

  svc.on('install', function () {
    svc.start();
  });
  svc.install();
}

async function startServer() {
  await require('./loaders').default();

  let workerService = container.get<WorkerService>(WorkerService.name);
  workerService.initializeScanner()
  workerService.initializeNFC()
}

// installService()

startServer();