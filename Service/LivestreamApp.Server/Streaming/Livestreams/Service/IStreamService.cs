﻿using LivestreamApp.Server.Streaming.Livestreams.Entities;
using System.Collections.Generic;

namespace LivestreamApp.Server.Streaming.Livestreams.Service
{
    /// <summary>
    ///     Provides functionality to manage streams
    /// </summary>
    public interface IStreamService
    {
        /// <summary>
        ///     Get streams
        /// </summary>
        List<Stream> GetStreams();

        /// <summary>
        ///     Create a new stream
        /// </summary>
        /// <param name="streamBackendEntity">Entity containing the new values</param>
        void CreateStream(StreamBackendEntity streamBackendEntity);

        /// <summary>
        ///     Update a stream
        /// </summary>
        /// <param name="streamBackendEntity">Entity containing the new values</param>
        void UpdateStream(StreamBackendEntity streamBackendEntity);

        /// <summary>
        ///     Delete stream
        /// </summary>
        /// <param name="id">Id of the stream to delete</param>
        void DeleteStream(string id);
    }
}