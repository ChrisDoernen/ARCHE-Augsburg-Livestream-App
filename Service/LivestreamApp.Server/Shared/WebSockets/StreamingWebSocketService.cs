﻿using LivestreamApp.Server.Streaming.Processes;
using LivestreamApp.Server.Streaming.StreamingSources;
using Ninject.Extensions.Logging;
using WebSocketSharp;
using WebSocketSharp.Server;

namespace LivestreamApp.Server.Shared.WebSockets
{
    public class StreamingWebSocketService : WebSocketBehavior
    {
        private readonly IStreamingSource _source;
        private readonly ILogger _logger;

        public StreamingWebSocketService(ILogger logger, IStreamingSource source)
        {
            _logger = logger;
            _source = source;
            IgnoreExtensions = true;
        }

        private void SendBytes(object sender, BytesReceivedEventArgs e)
        {
            Sessions?.Broadcast(e.Bytes);
        }

        protected override void OnOpen()
        {
            _source.BytesReceived += SendBytes;
            _logger.Info("Client connected");
        }

        protected override void OnClose(CloseEventArgs e)
        {
            _source.BytesReceived -= SendBytes;
            _logger.Info("Client disconnected");
        }

        protected override void OnError(ErrorEventArgs e)
        {
            _logger.Warn($"WebSocket service error: {e}");
        }
    }
}