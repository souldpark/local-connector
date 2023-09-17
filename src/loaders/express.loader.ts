import express from 'express';
import { InversifyExpressServer } from 'inversify-express-utils';
import { container } from '../config/inversify.config';
const https = require('https');
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { SocketService } from '../services/socket.service';
import { InstallService } from '../services/install.service';

export default async (port: string | undefined) => {
  const START_MSG = `⚡️[server]: Server is running at `;
  const PORT = port || 6299;
  // create server
  const server = new InversifyExpressServer(container);

  server.setConfig((app: any) => {
    app.use(function setCommonHeaders(req, res, next) {
      res.set('Access-Control-Allow-Private-Network', 'true');
      next();
    });

    app.use(cors());
    app.use(express.json());
  });

  const app = server.build();

  let installService = container.get<InstallService>(InstallService.name);
  const credentials = await installService.install()

  const httpsServer = https.createServer(credentials, app);

  let socketService = container.get<SocketService>(SocketService.name);

  socketService.init(httpsServer)

  httpsServer.listen(PORT, () => {
    console.log(START_MSG + PORT);
  });
};
