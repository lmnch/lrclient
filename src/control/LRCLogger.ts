import * as logger from "node-color-log";
import Endpoint from "../model/Endpoint";
import Environment from "../model/Environment";


export default class LRCLogger {

    logEnvironment(environmentKey: string, e: Environment){
        logger.bold().underscore().log(environmentKey);
        logger.bold().log("Headers:");
        Object.entries(e.headers).forEach(([key, variable]) => {
            logger.color("green").log(`${key}: ${variable.value}`)
        });

        logger.bold().log("Variables:");
        Object.entries(e.variableScope.variableStore).forEach(([key, variable])=>{
            logger.color("green").log(`${key}=${variable.value}`);
        });
        logger.log();
    }

    logEndpoint(endpointPath: string, e: Endpoint){
        logger.bold().underscore().color("black").log(endpointPath);
        let normalizedMethod = e.method.toString();
        while (normalizedMethod.length < 4) {
            normalizedMethod = " "+ normalizedMethod;
        }
        logger.bgColor("magenta").color("black").log(normalizedMethod).joint().color("blue").log(" "+e.url.value);
    }

};