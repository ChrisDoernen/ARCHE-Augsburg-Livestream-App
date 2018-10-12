﻿using Ninject.Extensions.Logging;

namespace LivestreamApp.Server.Streaming.StreamingSessions.States
{
    public class PausedSessionState : SessionState, ISessionState
    {
        public PausedSessionState(ILogger logger, ISessionStateFactory sessionStateFactory,
            ISession session) : base(logger, sessionStateFactory, session)
        {
        }

        public ISessionState StartSession()
        {
            throw new System.NotImplementedException();
        }

        public ISessionState EndSession()
        {
            throw new System.NotImplementedException();
        }

        public ISessionState PauseSession()
        {
            throw new System.NotImplementedException();
        }

        public ISessionState ResumeSession()
        {
            throw new System.NotImplementedException();
        }

        public ISessionState ScheduleSession()
        {
            throw new System.NotImplementedException();
        }

        public ISessionState UnschduleSession()
        {
            throw new System.NotImplementedException();
        }
    }
}
