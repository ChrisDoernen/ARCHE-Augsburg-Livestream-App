﻿using Nancy.Hosting.Self;
using System;
using System.Configuration;

namespace LivestreamService.Service.Startup
{
    public class Nancy
    {
        public static NancyHost GetHost()
        {
            var defaultPort = ConfigurationManager.AppSettings["DefaultPort"];

            var hostConfiguration = new HostConfiguration
            {
                UrlReservations = new UrlReservations { CreateAutomatically = true }
            };

            var uri = new Uri($"http://localhost:{defaultPort}");
            var nancyHost = new NancyHost(hostConfiguration, uri);
            return nancyHost;
        }
    }
}