import express from 'express';
import { InversifyExpressServer } from 'inversify-express-utils';
import { container } from '../config/inversify.config';
const https = require('https');
import cors from 'cors';
import fs from 'fs';
import os from 'os';
import { SocketService } from '../services/socket.service';

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
    app.use("/temp", express.static(os.tmpdir()))
  });

  const app = server.build();

  let cert = fs.readFileSync(`local-connector.pem`, { encoding: 'binary' });
  let key = fs.readFileSync(`local-connector-key.pem`, { encoding: 'binary' });

  const httpsServer = https.createServer({ key: key, cert: cert }, app);

  let socketService = container.get<SocketService>(SocketService.name);

  socketService.init(httpsServer)

  httpsServer.listen(PORT, () => {
    console.log(START_MSG + PORT);
  });
};
