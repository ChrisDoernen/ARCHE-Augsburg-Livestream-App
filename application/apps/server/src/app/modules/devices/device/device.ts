import { DeviceEntity } from "@liveo/entities";
import { Logger } from "../../core/services/logging/logger";
import { IStreamingSourceFactory } from "../../streaming/streaming-source-factory/i-streaming-source-factory";
import { IStreamingSource } from "../../streaming/streaming-sources/i-streaming-source";
import { DeviceState } from "./device-state";

/**
 * Represents a device in the system
 */
export class Device {
  private _source: IStreamingSource;
  private _deviceState: DeviceState = DeviceState.Available;

  public get entity(): DeviceEntity {
    return this._deviceData;
  }

  public get state(): DeviceState {
    return this._deviceState;
  }

  public get id(): string {
    return this._deviceData.id;
  }

  constructor(
    private readonly _logger: Logger,
    private readonly _deviceData: DeviceEntity,
    streamingSourceFactory: IStreamingSourceFactory
  ) {
    this._source = streamingSourceFactory(this.id, this.entity.streamingId, this.onStreamingSourceError.bind(this));

    if (this._deviceState === DeviceState.Available) {
      this._logger.debug(`Detected device ${JSON.stringify(this._deviceData)}.`);
    }

    if (this._deviceState === DeviceState.UnknownDevice) {
      this._logger.warn(`Device with id ${this._deviceData.id} was not detected in the system`);
    }
  }

  public startStreaming(): void {
    if (this._deviceState === DeviceState.Available) {
      this._source.startStreaming();
      this._deviceState = DeviceState.InUse;
    }
  }

  public stopStreaming(): void {
    if (this._deviceState === DeviceState.InUse) {
      this._source.stopStreaming();
      this._deviceState = DeviceState.Available;
    }
  }

  public onStreamingSourceError(error: Error): void {
    this._logger.error(`Streaming source error: ${error.message}`);
    this._deviceState = DeviceState.Available;
  }
}
