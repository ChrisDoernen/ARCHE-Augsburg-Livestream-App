import { SessionEntity, SettingsEntity, StreamEntity, UserEntity } from "@liveo/entities";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { existsSync } from "fs";
import * as low from "lowdb";
import * as FileSync from "lowdb/adapters/FileSync";
import { AppConfig, APP_CONFIG_TOKEN } from "../../config/configuration";
import { IdGenerator } from "../id-generation/id-generator";
import { DBSchema } from "./data-schema.enum";

/**
 * Provides access to a file based data source
 */
@Injectable()
export class DataService {

  private _database: any;

  constructor(
    private readonly _configService: ConfigService,
    private readonly _logger: Logger,
    private readonly _idGenerator: IdGenerator
  ) {
    this.initializeDatabase();
  }

  public initializeDatabase(): void {
    const db = this._configService.get<AppConfig>(APP_CONFIG_TOKEN).database;

    if (!existsSync(db)) {
      const error = new Error(`Database file does not exist: ${db}.`);
      this._logger.error(error.message);
      throw error;
    }

    const adapter = new FileSync(db);
    this._database = low(adapter);
    this._logger.debug("Database initialized");
  }

  public getSessionEntities(): SessionEntity[] {
    return this._database.get(DBSchema.SESSIONS).value() as SessionEntity[];
  }

  public getSessionEntity(id: string): SessionEntity {
    return this._database.get(DBSchema.SESSIONS).find({ id }).value() as SessionEntity;
  }

  public createSessionEntity(sessionEntity: SessionEntity): SessionEntity {
    sessionEntity.id = this.createNewId();
    this._database.get(DBSchema.SESSIONS).push(sessionEntity).write();

    return sessionEntity;
  }

  public deleteSessionEntity(id: string): void {
    this._database.get(DBSchema.SESSIONS).remove({ id }).write();
  }

  public getStreamEntities(): StreamEntity[] {
    return this._database.get(DBSchema.STREAMS).value() as StreamEntity[];
  }

  public getStreamEntity(id: string): StreamEntity {
    return this._database.get(DBSchema.STREAMS).find({ id }).value() as StreamEntity;
  }

  public createStreamEntity(streamEntity: StreamEntity): StreamEntity {
    streamEntity.id = this.createNewId();
    this._database.get(DBSchema.STREAMS).push(streamEntity).write();

    return streamEntity;
  }

  public deleteStreamEntity(id: string): void {
    this._database.get(DBSchema.STREAMS).remove({ id }).write();
  }

  public getSettings(): SettingsEntity {
    return this._database.get(DBSchema.SETTINGS).value() as SettingsEntity;
  }

  public async updateSettings(settings: SettingsEntity): Promise<SettingsEntity> {
    const updated = await this._database.update(DBSchema.SETTINGS, () => settings).write();

    return updated.settings;
  }

  public getUser(username: string): UserEntity {
    return this._database.get(DBSchema.USERS).find({ username }).value() as UserEntity;
  }

  private createNewId(): string {
    return this._idGenerator.generateId();
  }
}
