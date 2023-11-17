export default class LRCLoggerConfig {
  logEndpoint: boolean;
  logEndpointPayload: boolean;
  logEnvironments: boolean;
  logRequest: boolean;
  logRequestBody: boolean;
  logResponse: boolean;
  logResponseBody: boolean;

  constructor({
      logEndpoint = false,
      logEndpointPayload = false,
      logEnvironments = false,
      logRequest = true,
      logRequestBody = true,
      logResponse = true,
      logResponseBody = true,
  }) {
      this.logEndpoint = logEndpoint;
      this.logEndpointPayload = logEndpointPayload;
      this.logEnvironments = logEnvironments;
      this.logRequest = logRequest;
      this.logRequestBody = logRequestBody;
      this.logResponse = logResponse;
      this.logResponseBody = logResponseBody;
  }
}
