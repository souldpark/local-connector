import { Container } from 'inversify';
import { PrinterController } from '../controllers/printer.controller';
import { interfaces, TYPE } from 'inversify-express-utils';
import { PrinterService } from '../services/printer.service';
import { HealthController } from '../controllers/health.controller';
import { DeviceService } from '../services/device.service';
import { DeviceController } from '../controllers/devices.controller';
import { ConfigService } from '../services/config.service';
import { SocketService } from '../services/socket.service';
import { InstallService } from '../services/install.service';
import { WorkerService } from '../services/worker.service';

const container = new Container();

container
  .bind<ConfigService>(ConfigService.name)
  .to(ConfigService)
  .inSingletonScope();

container
  .bind<InstallService>(InstallService.name)
  .to(InstallService)
  .inSingletonScope();


container
  .bind<SocketService>(SocketService.name)
  .to(SocketService)
  .inSingletonScope();

container
  .bind<PrinterService>(PrinterService.name)
  .to(PrinterService)
  .inSingletonScope();

container
  .bind<DeviceService>(DeviceService.name)
  .to(DeviceService)
  .inSingletonScope();

container
  .bind<WorkerService>(WorkerService.name)
  .to(WorkerService)
  .inSingletonScope();

container
  .bind<interfaces.Controller>(DeviceController.name)
  .to(DeviceController);

container
  .bind<interfaces.Controller>(PrinterController.name)
  .to(PrinterController);

container
  .bind<interfaces.Controller>(HealthController.name)
  .to(HealthController);

export { container };
