import { ROUTES } from "@liveo/constants";
import { SettingsEntity } from "@liveo/entities";
import { Request } from "express";
import { inject } from "inversify";
import { controller, httpGet, httpPut } from "inversify-express-utils";
import { SettingsService } from "../../../../../server/src/app/services/settings/settings-service";
import { AuthenticationMiddleware } from "../../middleware/authentication/authentication.middleware";

@controller(`/${ROUTES.admin}/settings`, AuthenticationMiddleware)
export class SettingsController {

  constructor(
    @inject("SettingsService") private _settingsService: SettingsService) {
  }

  @httpGet("/")
  public getSettings(request: Request): SettingsEntity {
    return this._settingsService.getSettings();
  }

  @httpPut("/", AuthenticationMiddleware)
  public async putSettings(request: Request): Promise<SettingsEntity> {
    return await this._settingsService.updateSettings(request.body as SettingsEntity);
  }
}