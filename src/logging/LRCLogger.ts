import * as logger from "node-color-log";
import Endpoint from "../model/Endpoint";
import Environment from "../model/Environment";
import HttpMethod from "../model/HttpMethod";
import LRCRequest from "../model/LRCRequest";
import LRCResponse from "../model/LRCResponse";
import Payload from "../payload/Payload";
import LRCLoggerConfig from "./LRCLoggerConfig";

export default class LRCLogger {

    loggerConfig: LRCLoggerConfig;

    constructor(config: LRCLoggerConfig = new LRCLoggerConfig({})) {
        this.loggerConfig = config;
    }

    logEnvironment(environmentKey: string, e: Environment) {
        if (this.loggerConfig.logEnvironments) {
            logger.bold().underscore().log(environmentKey);
            logger.bold().log("Headers:");
            Object.entries(e.headers).forEach(([key, variable]) => {
                logger.color("green").log(`${key}: ${variable.value}`)
            });

            logger.bold().log("Variables:");
            Object.entries(e.variableScope.variableStore).forEach(([key, variable]) => {
                logger.color("green").log(`${key}=${variable.value}`);
            });

            this.nl();
        }
    }

    logEndpoint(endpointPath: string, e: Endpoint) {
        if (this.loggerConfig.logEndpoint) {
            logger.bold().underscore().color("black").log(endpointPath);
            let normalizedMethod = e.method.toString();
            while (normalizedMethod.length < 4) {
                normalizedMethod = " " + normalizedMethod;
            }
            logger.bgColor("magenta").color("black").log(normalizedMethod).joint().color("blue").log(" " + e.url.value);

            Object.entries(e.headers).forEach(([key, variable]) => {
                logger.color("cyan").log(`${key}: ${variable.value}`)
            });
        }
        if (this.loggerConfig.logEndpointPayload && e.payload) {
            logger.color("blue").log(e.payload.toString());
        }
        if (this.loggerConfig.logEndpoint || this.loggerConfig.logEndpointPayload && e.payload) {
            this.nl();
        }
    }

    logRequest(req: LRCRequest) {
        if (this.loggerConfig.logRequest) {
            logger.bold().underscore().color("black").log("Request:");
            let normalizedMethod = req.method.toString();
            while (normalizedMethod.length < 4) {
                normalizedMethod = " " + normalizedMethod;
            }
            logger.bgColor("magenta").color("black").log(normalizedMethod).joint().color("blue").log(" " + req.url);
            Object.entries(req.headers).forEach(([key, header]) => {
                logger.color("cyan").log(`${key}: ${header}`)
            });
        }
        if (this.loggerConfig.logRequestBody && req.body) {
            logger.color("blue").log(req.body);
        }

        if (this.loggerConfig.logRequest || this.loggerConfig.logRequestBody && req.body) {
            this.nl();
        }
    }

    async logResponse(response: LRCResponse) {
        if (this.loggerConfig.logResponse) {
            logger.bold().underscore().color("white").log("Response:");

            logger.bgColor(response.status < 300 ? "green" :
                response.status > 400 && response.status < 500 ? "red" :
                    response.status >= 500 ? "magenta" :
                        "white")
                .color("black").log(response.status).joint().color("white").log(" " + response.statusText);

            Object.entries(response.headers).forEach(([key, header]) => {
                logger.color("yellow").log(`${key}: ${header}`)
            });
        }

        let loggedPayload = false;
        if (this.loggerConfig.logResponseBody) {
            // Try extracting payload
            try {
                const payload = await response.extractPayload()
                logger.color("white").log(payload?.toString());
                loggedPayload = true;
            } catch (e: any) {
                this.logError(e.message, e);
            }

        }

        if (this.loggerConfig.logResponse || this.loggerConfig.logResponseBody && loggedPayload) {
            this.nl()
        }
    }

    logError(message: string | undefined, e: Error) {
        logger.bgColor("red").color("black").log(message);
        logger.color("red").log(e.message);
        logger.color("red").log(e.stack);
        this.nl();
    }

    nl() {
        logger.log();
    }

};