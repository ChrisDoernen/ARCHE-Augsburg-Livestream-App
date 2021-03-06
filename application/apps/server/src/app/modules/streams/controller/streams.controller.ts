import { ENDPOINTS, ROUTES } from "@liveo/constants";
import { StreamEntity } from "@liveo/entities";
import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { StreamsService } from "../services/streams/streams.service";

@Controller(`${ENDPOINTS.api}/${ROUTES.admin}/streams`)
export class StreamsController {

  constructor(
    private readonly _streamService: StreamsService
  ) {
  }

  @Get()
  public getStreams(): StreamEntity[] {
    return this._streamService.getStreamEntities();
  }

  @Get(":id")
  public getStream(@Param("id") id): StreamEntity {
    return this._streamService.getStreamEntity(id);
  }

  @Post()
  public createStream(@Body() stream: StreamEntity): StreamEntity {
    return this._streamService.createStream(stream);
  }

  @Delete(":id")
  public deleteStream(@Param("id") id): void {
    this._streamService.deleteStream(id);
  }
}
