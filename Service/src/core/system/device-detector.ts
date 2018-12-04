import { Logger } from "../util/logger";
import { injectable } from "inversify";
import { CommandExecutionService } from "./command-execution-service";

@injectable()
export class DeviceDetector {

    public devices: string[];

    private listDevicesCommand: string = "ffmpeg -list_devices true -f dshow -i dummy -hide_banner";

    private audioDeviceRegexPattern: string = `(?<="")(.*?)(?="")`;

    constructor(private logger: Logger,
        private commandExecutionService: CommandExecutionService) {
        this.logger.debug("Detecting audio inputs.");
        this.detectDevices();
    }

    private detectDevices(): void {
        const response = this.commandExecutionService.executeWithResponse(this.listDevicesCommand);
        const lines = response.split("\n");
        this.devices = lines.filter((line) => this.lineContainsAudioDevice(line))
            .map((line) => line.match(this.audioDeviceRegexPattern)[0]);
    }

    private lineContainsAudioDevice(line: string): boolean {
        return line.includes("(") && line.includes(")") && line.includes("\"");
    }
}
