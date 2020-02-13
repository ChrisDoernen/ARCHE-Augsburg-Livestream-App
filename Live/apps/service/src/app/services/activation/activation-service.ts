import { EVENTS } from "@live/constants";
import { ActivationEntity, ActivationState, Shutdown } from "@live/entities";
import { inject, injectable } from "inversify";
import { BehaviorSubject } from "rxjs";
import { WebsocketServer } from "../../core/websocket-server";
import { Logger } from "../logging/logger";
import { Scheduler } from "../scheduling/scheduler";
import { Session } from "../sessions/session";
import { SessionService } from "../sessions/session-service";
import { ShutdownService } from "../shutdown/shutdown-service";
import { TimeService } from "../time/time.service";

@injectable()
export class ActivationService {

  private _activation: ActivationEntity;
  private _activeSession: Session;
  private _sessionStartJobId: string;
  private _sessionStopJobId: string;
  public activation$ = new BehaviorSubject<ActivationEntity>(null);

  constructor(
    @inject("Logger") private readonly _logger: Logger,
    @inject("SessionService") private readonly _sessionService: SessionService,
    @inject("Scheduler") private readonly _scheduler: Scheduler,
    @inject("ShutdownService") private readonly _shutdownService: ShutdownService,
    @inject("TimeService") private readonly _timeService: TimeService,
    @inject("WebsocketServer") private readonly _weboscketServer: WebsocketServer) {
  }

  public setActivation(activation: ActivationEntity): ActivationEntity {
    this._logger.info(`Received new activation: ${JSON.stringify(activation)}.`);

    if (this._activation) {
      throw new Error("Can not set new activation before deleting the current.");
    }

    this.validateActivation(activation);

    const session = this._sessionService.getSession(activation.sessionId);

    if (activation.startTime) {
      this._sessionStartJobId = this._scheduler.schedule(new Date(activation.startTime), () => {
        session.start();
        this.sendActivationStateUpdate("Started");
      });
    } else {
      session.start();
      activation.startTime = new Date(this._timeService.now()).toISOString();
    }

    if (activation.endTime) {
      this._sessionStopJobId = this._scheduler.schedule(new Date(activation.endTime), () => {
        session.stop();
        this.sendActivationStateUpdate("Ended");
      });
    }

    if (activation.shutdownTime) {
      this._shutdownService.setShutdown(new Shutdown(activation.shutdownTime));
    }

    this._activation = activation;
    this.activation$.next(activation);
    this._activeSession = session;
    this._logger.debug("Activation set");

    return this._activation;
  }

  private validateActivation(activation: ActivationEntity): void {
    if (!activation.sessionId) {
      throw new Error("Activation validation error: Session id is null.");
    }

    if (activation.startTime && new Date(activation.startTime) < this._timeService.now()) {
      throw new Error("Activation validation error: The start time is not in the future.");
    }

    if (activation.endTime && new Date(activation.endTime) < new Date(activation.startTime)) {
      throw new Error("Activation validation error: Time ending is lower than time starting.");
    }

    if (activation.shutdownTime && new Date(activation.shutdownTime) < new Date(activation.endTime)) {
      throw new Error("Activation validation error: Time server shutdown is lower than time ending.");
    }
  }

  public deleteActivation(): ActivationEntity {
    if (!this._activation) {
      throw new Error("Can not delete activation, no activation existing.");
    }

    const now = this._timeService.now();

    if (this._activation.startTime && new Date(this._activation.startTime) > now) {
      this._scheduler.cancelJob(this._sessionStartJobId);
    } else {
      this._activeSession.stop();
    }

    if (this._activation.endTime && new Date(this._activation.endTime) > now) {
      this._scheduler.cancelJob(this._sessionStopJobId);
    }

    if (this._activation.shutdownTime) {
      this._shutdownService.cancelShutdown();
    }

    this._activation = null;
    this.activation$.next(null);
    this._activeSession = null;
    this.sendActivationStateUpdate("NoActivation");
    this._logger.debug("Activation deleted");

    return this._activation;
  }

  public getActivationEntity(): ActivationEntity {
    return this._activation;
  }

  private sendActivationStateUpdate(activationState: ActivationState): void {
    this._weboscketServer.emitAdminEventMessage(EVENTS.adminActivationStateUodate, activationState);
    this._logger.info(`Sent activation state update to admin, new state: ${activationState}`);
  }
}
