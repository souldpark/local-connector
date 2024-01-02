process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { container } from "./config/inversify.config"
import { WorkerService } from './services/worker.service';
import AutoUpdater from 'auto-updater';

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

async function updateApp() {
    var autoupdater = new AutoUpdater({
    pathToJson: '',
    autoupdate: false,
    checkgit: true,
    jsonhost: 'https://github.com/souldpark/local-connector/blob/main/package.json',
    contenthost: 'https://github.com/souldpark/local-connector',
    progressDebounce: 0,
    devmode: false
   });

   // State the events
   autoupdater.on('git-clone', function() {
     console.log("You have a clone of the repository. Use 'git pull' to be up-to-date");
   });
   autoupdater.on('check.up-to-date', function(v) {
     console.info("You have the latest version: " + v);
   });
   autoupdater.on('check.out-dated', function(v_old, v) {
     console.warn("Your version is outdated. " + v_old + " of " + v);
     autoupdater.fire('download-update'); // If autoupdate: false, you'll have to do this manually.
     // Maybe ask if the'd like to download the update.
   });
   autoupdater.on('update.downloaded', function() {
     console.log("Update downloaded and ready for install");
     autoupdater.fire('extract'); // If autoupdate: false, you'll have to do this manually.
   });
   autoupdater.on('update.not-installed', function() {
     console.log("The Update was already in your folder! It's read for install");
     autoupdater.fire('extract'); // If autoupdate: false, you'll have to do this manually.
   });
   autoupdater.on('update.extracted', function() {
     console.log("Update extracted successfully!");
     console.warn("RESTART THE APP!");
   });
   autoupdater.on('download.start', function(name) {
     console.log("Starting downloading: " + name);
   });
   autoupdater.on('download.progress', function(name, perc) {
     process.stdout.write("Downloading " + perc + "%[0G");
   });
   autoupdater.on('download.end', function(name) {
     console.log("Downloaded " + name);
   });
   autoupdater.on('download.error', function(err) {
     console.error("Error when downloading: " + err);
   });
   autoupdater.on('end', function() {
     console.log("The app is ready to function");
   });
   autoupdater.on('error', function(name, e) {
     console.error(name, e);
   });

   // Start checking
   autoupdater.fire('check');
}
updateApp();
startServer();


