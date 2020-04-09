import { DeviceEntity } from "@liveo/entities";
import createMockInstance from "jest-create-mock-instance";
import "reflect-metadata";
import { Logger } from "../../../../../server/src/app/services/logging/logger";
import { PLATFORM_CONSTANTS } from "../../../../../server/src/app/services/platform-constants/platform-constants";
import { ProcessExecutionService } from "../../../../../server/src/app/services/process-execution/process-execution-service";
import { IdGenerator } from "../id-generation/id-generator";
import { Device } from "./device";
import { DeviceState } from "./device-state";
import { MacOSDeviceDetector } from "./macos-device-detector";

describe("MacOSDeviceDetector", () => {
  let macOsDeviceDetector: MacOSDeviceDetector;
  let processExecutionService: jest.Mocked<ProcessExecutionService>;
  let idGenerator: jest.Mocked<IdGenerator>;
  const platformConstants = PLATFORM_CONSTANTS.darwin;
  let deviceFactory: any;
  const ffmpegPath = "ffmpeg";

  beforeEach(() => {
    const logger = createMockInstance(Logger);
    idGenerator = createMockInstance(IdGenerator);
    processExecutionService = createMockInstance(ProcessExecutionService);
    deviceFactory = jest.fn((deviceData: DeviceEntity, deviceState: DeviceState) => new Device(logger, jest.fn(), deviceData, deviceState));

    macOsDeviceDetector = new MacOSDeviceDetector(logger, platformConstants, ffmpegPath, processExecutionService, idGenerator, deviceFactory);
  });

  it("should construct", async () => {
    expect(macOsDeviceDetector).toBeDefined();
  });

  it("should parse devices correctly", async () => {
    jest.spyOn(processExecutionService, "execute").mockImplementation((command: string, callback: any) => callback(null, null, output));

    const devices = await macOsDeviceDetector.runDetection();

    expect(devices.length).toBe(3);
    expect(devices[0].id).toBe("0");
    expect(devices[0].entity.description).toBe("FaceTime HD Camera");
    expect(devices[1].id).toBe("1");
    expect(devices[1].entity.description).toBe("Capture screen 0");
    expect(devices[2].id).toBe("0");
    expect(devices[2].entity.description).toBe("Built-in Microphone");
  });
});

const output =
  `[AVFoundation input device @ 0x7f890974afc0] AVFoundation video devices:
[AVFoundation input device @ 0x7f890974afc0] [0] FaceTime HD Camera
[AVFoundation input device @ 0x7f890974afc0] [1] Capture screen 0
[AVFoundation input device @ 0x7f890974afc0] AVFoundation audio devices:
[AVFoundation input device @ 0x7f890974afc0] [0] Built-in Microphone
: Input/output error`;