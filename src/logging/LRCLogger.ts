import * as logger from "node-color-log";
import Endpoint from "../model/Endpoint";
import Environment from "../model/Environment";
import HttpMethod from "../model/HttpMethod";
import Payload from "../payload/Payload";

export default class LRCLogger {

    logEnvironment(environmentKey: string, e: Environment) {
        logger.bold().underscore().log(environmentKey);
        logger.bold().log("Headers:");
        Object.entries(e.headers).forEach(([key, variable]) => {
            logger.color("green").log(`${key}: ${variable.value}`)
        });

        logger.bold().log("Variables:");
        Object.entries(e.variableScope.variableStore).forEach(([key, variable]) => {
            logger.color("green").log(`${key}=${variable.value}`);
        });
    }

    logEndpoint(endpointPath: string, e: Endpoint) {
        logger.bold().underscore().color("black").log(endpointPath);
        let normalizedMethod = e.method.toString();
        while (normalizedMethod.length < 4) {
            normalizedMethod = " " + normalizedMethod;
        }
        logger.bgColor("magenta").color("black").log(normalizedMethod).joint().color("blue").log(" " + e.url.value);

        Object.entries(e.headers).forEach(([key, variable]) => {
            logger.color("cyan").log(`${key}: ${variable.value}`)
        });
        
        if (e.payload) {
            logger.color("blue").log(e.payload.toString());
        }
    }

    logRequest(method: HttpMethod, url: string, headers: { [key: string]: string }, body: any = "") {
        logger.bold().underscore().color("black").log("Requesting...");
        let normalizedMethod = method.toString();
        while (normalizedMethod.length < 4) {
            normalizedMethod = " " + normalizedMethod;
        }
        logger.bgColor("magenta").color("black").log(normalizedMethod).joint().color("blue").log(" " + url);
        Object.entries(headers).forEach(([key, header]) => {
            logger.color("cyan").log(`${key}: ${header}`)
        });
        if (body) {
            logger.color("blue").log(body);
        }
    }

    logResponse(status: number, statusText: string, headers: { [key: string]: string }, payload: Payload) {
        logger.bold().underscore().color("white").log("Response:");

        logger.bgColor(status < 300 ? "green" : status > 400 && status < 500 ? "red" : status >= 500 ? "magenta" : "white").color("black").log(status).joint().color("white").log(" "+ statusText);

        Object.entries(headers).forEach(([key, header]) => {
            logger.color("yellow").log(`${key}: ${header}`)
        });

        if (payload) {
            logger.color("white").log(payload.toString());
        }
    }

    nl() {
        logger.log();
    }

};