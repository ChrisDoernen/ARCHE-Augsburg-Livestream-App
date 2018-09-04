﻿namespace LivestreamApp.Server.Streaming.ProcessCommunication
{
    public interface IExternalProcess
    {
        event ExternalProcess.OnErrorDataReceived ErrorDataReceived;
        event ExternalProcess.OnOutDataReceived OutputDataReceived;
        event ExternalProcess.OnProcessReturned ProcessExited;

        int ExecuteCommandAndWaitForExit(string command);
        bool IsResponding();
        bool IsRunning();
        void Kill();
    }
}