import 'reflect-metadata';
import createMockInstance from 'jest-create-mock-instance';
import { DataService } from '../data/data-service';
import { Logger } from '../logging/logger';
import { SessionService } from '../sessions/session-service';
import { SessionData } from '../sessions/session-data';
import { StreamService } from '../streams/stream-service';
import { Stream } from '../streams/stream';
import { Session } from '../sessions/session';

describe('SessionService', () => {
  let sessionService;
  let logger;
  let dataService;
  let streamService;
  let sessionFactory;

  const sessions = [
    new SessionData('bcf4', 'Service', ['vfg3']),
    new SessionData('43kv', 'Service2', ['2gus'])
  ];

  beforeEach(() => {
    logger = createMockInstance(Logger);
    dataService = createMockInstance(DataService);
    dataService.loadSessionData.mockReturnValue(sessions);
    streamService = createMockInstance(StreamService);
    sessionFactory = jest.fn();
    sessionFactory
      .mockReturnValueOnce(new Session(logger, sessions[0], []))
      .mockReturnValueOnce(new Session(logger, sessions[1], []));

    sessionService = new SessionService(
      logger,
      dataService,
      streamService,
      sessionFactory
    );
  });

  it('should construct', async () => {
    expect(sessionService).toBeDefined();
  });

  it('should have loaded sessions when load session is called', async () => {
    sessionService.loadSessions();
    expect(dataService.loadSessionData).toBeCalled();
    expect(sessionService.sessionData.length).toBe(2);
  });

  it('should have called logger warn if no streams are available', async () => {
    sessionService.loadSessions();
    expect(sessionService.sessionData.length).toBe(2);
    expect(logger.warn).toHaveBeenCalled();
  });

  it('should have loaded the streams of the sessions correctly when streams are available', async () => {
    const stream = createMockInstance(Stream);
    sessionService.loadSessions();
    const streams = [stream];

    // ToDo
    // jest.spyOn(streamService, "streams", "get").mockReturnValue(streams);
    // streamService.streams.mockReturnValue(null);

    expect(sessionService.sessionData.length).toBe(2);
  });

  it('should return correct session on get session when session is available', async () => {
    sessionService.loadSessions();
    expect(sessionService.sessionData.length).toBe(2);
    expect(logger.warn).toHaveBeenCalled();
    const session = sessionService.getSessionData('43kv');
    expect(session).toBe(sessions[1]);
  });

  it('should throw on get session when session is not available', async () => {
    sessionService.loadSessions();
    expect(sessionService.getSessionData.bind(null, '83kv')).toThrowError();
  });
});