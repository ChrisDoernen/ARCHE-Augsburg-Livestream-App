import { DeviceEntity, DeviceType } from "@live/entities";
import { inject, injectable } from "inversify";
import { EOL } from "os";
import { AudioSystem } from "../audio-system/audio-system";
import { Logger } from "../logging/logger";
import { ProcessExecutionService } from "../process-execution/process-execution-service";
import { Device } from "./device";
import { DeviceDetector } from "./device-detector";
import { DeviceState } from "./device-state";

/**
 * Implementation of device detection on mac os
 */
@injectable()
export class MacOSDeviceDetector extends DeviceDetector {

  constructor(
    @inject("Logger") logger: Logger,
    @inject("AudioSystem") audioSystem: AudioSystem,
    @inject("FfmpegPath") ffmpegPath: string,
    @inject("ProcessExecutionService") processExecutionService: ProcessExecutionService,
    @inject("DeviceFactory") deviceFactory: (deviceData: DeviceEntity, deviceState: DeviceState) => Device) {
    super(logger, processExecutionService, deviceFactory);
    this.listDevicesCommand = `${ffmpegPath} -f ${audioSystem.audioSystem} -list_devices true -i '' -hide_banner`;
  }

  protected parseResponse(response: string): Device[] {
    const prefix = /^\[AVFoundation/;
    const audioSeparator = /AVFoundation\saudio\sdevices/;
    const deviceParams = /^\[AVFoundation.*?\]\s\[(\d*?)\]\s(.*)$/;
    const searchPrefix = (line: string) => (line.search(prefix) > -1);
    const searchAudioSeparator = (line: string) => isVideo && (line.search(audioSeparator) > -1);

    const devices = [];
    let isVideo = true;

    response.split(EOL)
      .filter(searchPrefix)
      .forEach((line) => {
        if (searchAudioSeparator(line)) {
          isVideo = false;
          return;
        }
        const params = line.match(deviceParams);
        if (params) {
          const id = params[1];
          const name = params[2]
          const deviceType = isVideo ? DeviceType.Video : DeviceType.Audio
          devices.push(this.instantiateDevice(id, name, deviceType, DeviceState.Available));
        }
      });

    return devices;
  }
}