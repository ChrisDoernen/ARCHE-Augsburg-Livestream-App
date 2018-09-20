﻿using LivestreamApp.Server.Streaming.Environment;
using LivestreamApp.Server.Streaming.Processes;
using Ninject.Extensions.Logging;
using System;

namespace LivestreamApp.Server.Streaming.Core
{
    public class Mp3Streamer : IDisposable
    {
        private readonly ILogger _logger;
        private readonly IProcessAdapter _processAdapter;
        public AudioDevice AudioDevice { get; }
        private const string FileName = "ffmpeg.exe";
        public event EventHandler<BytesReceivedEventArgs> OutputBytesReceived;

        public Mp3Streamer(ILogger logger, IProcessAdapter processAdapter, AudioDevice audioDevice)
        {
            _logger = logger;
            AudioDevice = audioDevice;
            _processAdapter = processAdapter;
        }

        private string GetArguments()
        {
            return
                "-y -f dshow " +
                $"-i audio=\"{AudioDevice.Id}\" " +
                "-rtbufsize 64 " +
                "-probesize 64 " +
                "-acodec libmp3lame " +
                "-ab 320k " +
                "-ar 44100 " +
                "-ac 1 " +
                "-reservoir 0 " +
                "-f mp3 " +
                "-hide_banner " +
                "-fflags " +
                "+nobuffer " +
                "pipe:1";
        }

        public void Start()
        {
            var arguments = GetArguments();
            _processAdapter.OutputBytesReceived += OutputBytesReceivedHandler;
            _processAdapter.ExecuteAndReadAsync(FileName, arguments, 4000);

            _logger.Info($"Started capturing audio on input {AudioDevice.Id}.");
        }

        public void Stop()
        {
            _processAdapter.OutputBytesReceived -= OutputBytesReceivedHandler;
            _processAdapter.KillProcess();

            _logger.Info($"Stopped capturing audio on input {AudioDevice.Id}.");
        }

        private void OutputBytesReceivedHandler(object sender, BytesReceivedEventArgs e)
        {
            OutputBytesReceived?.Invoke(null, e);
        }

        public void Dispose()
        {
            Stop();
        }
    }
}
