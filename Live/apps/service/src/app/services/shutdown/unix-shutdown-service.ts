import { inject, injectable } from "inversify";
import { Logger } from "../logging/logger";
import { ProcessExecutionService } from "../process-execution/process-execution-service";
import { ShutdownService } from "./shutdown-service";

/**
 * Unix implementation for ShutdownService
 */
@injectable()
export class UnixShutdownService extends ShutdownService {

  constructor(
    @inject("Logger") logger: Logger,
    @inject("ProcessExecutionService") private _processExecutionService: ProcessExecutionService) {
    super(logger);
    logger.debug("Instantiating unix shutdown service.");
  }

  public executeShutdown(): void {
    this.logger.debug("Shutting down server now.");
    this._processExecutionService.execute("sudo shutdown -h now");
  }
}
