

export default class LRCLoggerConfig {

    logEndpoint: boolean;
    logEnvironments: boolean;
    logRequest: boolean;
    logResponse: boolean;
    logResponseBody: boolean;

    constructor({ logEndpoint = false, logEnvironments = false, logRequest = true, logResponse = true, logResponseBody = true }) {
        this.logEndpoint = logEndpoint;
        this.logEnvironments = logEnvironments;
        this.logRequest = logRequest;
        this.logResponse = logResponse;
        this.logResponseBody = logResponseBody;
    }

}