import { Global, Module } from "@nestjs/common";
import { SharedModule } from "../shared/shared.module";
import { DevicesController } from "./controller/devices.controller";
import { DeviceDetectorProvider } from "./services/device-detection/device-detector.provider";
import { DeviceFactoryProvider } from "./services/device-detection/device-factory.provider";
import { DeviceService } from "./services/devices/device.service";

@Global()
@Module({
  imports: [
    SharedModule
  ],
  controllers: [
    DevicesController
  ],
  providers: [
    DeviceService,
    DeviceDetectorProvider,
    DeviceFactoryProvider,
  ]
})
export class DevicesModule { }
