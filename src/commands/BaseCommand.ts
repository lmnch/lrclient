import { Command, Flags } from "@oclif/core";
import LRCLoggerConfig from "../logging/LRCLoggerConfig";

export enum LoggedFields {
    env = 'env',
    endpoint = 'endpoint',
    endpoint_payload = `endpoint_payload`,
    req = 'req',
    req_body = 'req_body',
    resp = 'resp',
    resp_body = 'resp_body'
}


export default abstract class BaseCommand extends Command {

    static globalFlags = {
        'loggedFields': Flags.enum<LoggedFields>({
            summary: 'Specify level for logging.',
            options: Object.values(LoggedFields),
            helpGroup: 'GLOBAL',
            multiple: true,
            aliases: ['l']
        }),
    }

    /**
     * ORs a logger config based on the passed field with the default logger config of the command.
     * This can be used to enable additional logs.
     * 
     * @param fields fields passed by flags
     * @returns resulting logger config
     */
    getLoggerConfig(fields: LoggedFields[]|undefined): LRCLoggerConfig{
        if(!fields || fields.length==0){
            return  this._getDefaultLogging();
        }
        return new LRCLoggerConfig({ 
            logEndpoint: fields.includes(LoggedFields.endpoint), 
            logEndpointPayload: fields.includes(LoggedFields.endpoint_payload),
            logEnvironments:  fields.includes(LoggedFields.env),
            logResponse:  fields.includes(LoggedFields.resp),
            logRequestBody: fields.includes(LoggedFields.req_body),
            logRequest:  fields.includes(LoggedFields.req), 
            logResponseBody:  fields.includes(LoggedFields.resp_body) 
        });
    }

    _getDefaultLogging(): LRCLoggerConfig{
        return new LRCLoggerConfig({});
    }
}