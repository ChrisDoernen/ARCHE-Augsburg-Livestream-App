import { StreamEntity } from "@liveo/entities";
import { Injectable } from "@nestjs/common";
import { Logger } from "../../../core/services/logging/logger";
import { StreamsRepository } from "./streams-repository";

/**
 * A class providing methods to manage streams
 */
@Injectable()
export class StreamsService {

  constructor(
    private readonly _logger: Logger,
    private readonly _streamRepository: StreamsRepository) {
  }

  public getStreamEntities(): StreamEntity[] {
    return this._streamRepository.getStreamEntities();
  }

  public getStreamEntity(id: string): StreamEntity {
    return this._streamRepository.getStreamEntity(id);
  }

  public createStream(streamEntity: StreamEntity): StreamEntity {
    const createdStreamEntity = this._streamRepository.createStreamEntity(streamEntity);
    this._logger.debug(`Created stream ${JSON.stringify(streamEntity)}`);

    return createdStreamEntity;
  }

  public deleteStream(id: string): void {
    this._streamRepository.deleteStreamEntity(id);
    this._logger.debug(`Deleted stream ${id}`);
  }
}
