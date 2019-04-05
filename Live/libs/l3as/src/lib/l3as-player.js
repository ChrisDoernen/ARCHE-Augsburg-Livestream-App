import WebSocketClient from "./websocket-client.js";
import PCMAudioPlayer from "./pcm-audio-player.js";
import AudioFormatReader_MPEG from "./audio-format-reader-mpeg.js";

/*
  L3asPlayer is my wrapper around 3las (https://github.com/JoJoBond/3LAS) to make it a node module.
  The "3" and "l" are switched because the angular lib naming convention (no number as first sign)
*/
export class L3asPlayer {

  constructor(port) {
    if (typeof port === 'undefined') {
      port = 80;
    }

    this.playerControls;
    this.audioPlayer;
    this.formatReader;
    this.socketClient;
    this.mime = "audio/mpeg";
    this.port = port;
    this.userAgentInfo;
    this.isBrowserCompatible;
    this.packetModCounter = 0;
    this.lastVolume;

    // Check if page has lost focus (e.g. switching apps on mobile)
    this.lastCheckTime;
    this.focusChecker = null;

    this.detectUserAgent();
    this.checkBrowserCompatibility();

    this.logEvent(`Initialize 3las player with port ${this.port}.`);
    this.logEvent(`Browser compatibility ${this.isBrowserCompatible}.`);
  }

  // Pubic methods (external functions):
  // ===================================

  setVolume(value) {
    this.lastVolume = value;
    this.audioPlayer.SetVolume(value);
  }

  mute() {
    this.audioPlayer.SetVolume(0);
  }

  unmute() {
    this.audioPlayer.SetVolume(this.lastVolume);
  }

  play(streamId) {
    if (!streamId) {
      throw new Error("No streamId given.");
    }

    try {
      this.audioPlayer = new PCMAudioPlayer();
      this.audioPlayer.UnderrunCallback = this.onPlayerUnderrun;
      this.logEvent("Init of PCMAudioPlayer succeeded");
    } catch (e) {
      this.logEvent("Init of PCMAudioPlayer failed: " + e);
      return;
    }

    try {
      this.formatReader = CreateAudioFormatReader(this.mime, this.onReaderError, this.onReaderDataReady);
      this.logEvent("Init of AudioFormatReader succeeded");
    } catch (e) {
      this.logEvent("Init of AudioFormatReader failed: " + e);
      return;
    }

    if (!this.socketClient || !this.socketClient.GetStatus()) {
      this.audioPlayer.MobileUnmute();
      try {
        this.logEvent("Play was clicked, trying to connect to server.");
        this.socketClient = new WebSocketClient('ws://' + ServerName + ':' + SelectedPORT.toString(), streamId,
          this.onSocketError, this.onSocketConnect, this.onSocketDataReady, this.onSocketDisconnect);
        this.logEvent("Init of WebSocketClient succeeded");
        this.logEvent("Trying to connect to server.");
      } catch (e) {
        this.logEvent("Init of WebSocketClient failed: " + e);
        return;
      }
    }
  }

  stop() {
    this.logEvent("Disconnecting.");
    if (this.playerControls) {
      this.playerControls.Stop();
      this.playerControls.RemoveEventListener();
      this.playerControls = null;
    }

    if (this.socketClient) {
      this.logEvent("Disposing socket client.");
      this.socketClient.Disconnect();
      this.socketClient = null;
    }
  }

  // Internal callback functions
  // ===========================

  createAudioFormatReader(mime, errorCallback, dataReadyCallback) {
    if (typeof mime !== "string")
      throw new Error('CreateAudioFormatReader: Invalid mime-Type, must be string');

    // Load format handler according to mime-Type
    switch (mime.replace(/\s/g, "")) {
      // MPEG Audio (mp3)
      case "audio/mpeg":
      case "audio/MPA":
      case "audio/mpa-robust":
        if (!CanDecodeTypes(new Array("audio/mpeg", "audio/MPA", "audio/mpa-robust")))
          throw new Error('CreateAudioFormatReader: Browser can not decode specified mime-Type (' + mime + ')');

        return new AudioFormatReader_MPEG(errorCallback, dataReadyCallback);

      // Unknown codec
      default:
        throw new Error('CreateAudioFormatReader: Specified mime-Type (' + mime + ') not supported');
    }
  }

  // Callback functions from format reader
  onReaderError() {
    this.logEvent("Reader error: Decoding failed.");
  }

  onReaderDataReady(data) {
    while (this.formatReader.SamplesAvailable()) {
      this.audioPlayer.PushBuffer(this.formatReader.PopSamples());
    }
  }

  onPlayerUnderrun() {
    this.logEvent("Player underrun");
  }

  // Callback function from socket connection
  onSocketError(error) {
    this.logEvent("Network error: " + error);
  }

  onSocketConnect() {
    this.playerControls.SetPlaystate(true);
    this.startFocusChecker();
    this.logEvent("Established connection with server.");
  }

  onSocketDisconnect() {
    this.playerControls.SetPlaystate(false);
    this.__StopFocusChecker();
    this.logEvent("Lost connection to server.");
  }

  onSocketDataReady(data) {
    this.packetModCounter++;

    if (this.packetModCounter > 100) {
      this.toogleActivityLight();
      this.packetModCounter = 0;
    }

    this.formatReader.PushData(data);
  }

  toogleActivityLight = function () {
  }

  startFocusChecker() {
    if (FocusChecker == null) {
      LastCheckTime = Date.now();
      FocusChecker = window.setInterval(CheckFocus, 2000);
    }
  }

  stopFocusChecker() {
    if (FocusChecker != null) {
      window.clearInterval(FocusChecker);
      FocusChecker = null;
    }
  }

  checkFocus() {
    var CheckTime = Date.now();
    // Check if focus was lost
    if (CheckTime - LastCheckTime > 10000) {
      // If so, drop all samples in the buffer
      LogEvent("Focus lost, purging format reader.")
      FormatReader.PurgeData();
    }
    LastCheckTime = CheckTime;
  }

  logEvent(message) {
    console.log(message);
  }
}