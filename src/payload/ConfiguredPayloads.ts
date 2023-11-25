import ConfiguredEntity from "../config/ConfiguredEntity";
import Payload from "./Payload";
import PayloadFile from "./PayloadFile";
import PayloadJson from "./PayloadJson";
import PayloadText from "./PayloadText";

export interface ConfiguredPayload extends ConfiguredEntity, Payload {}

export class ConfiguredPayloadFile
    extends PayloadFile
    implements ConfiguredPayload
{
    path: string;

    constructor(path: string, payloadPath: string) {
        super(payloadPath);
        this.path = path;
    }

    getConfigPath(): string {
        return this.path;
    }
}

export class ConfiguredPayloadJson
    extends PayloadJson
    implements ConfiguredPayload
{
    path: string;

    constructor(path: string, jsonData: string) {
        super(jsonData);
        this.path = path;
    }

    getConfigPath(): string {
        return this.path;
    }
}

export class ConfiguredPayloadText
    extends PayloadText
    implements ConfiguredPayload
{
    path: string;

    constructor(path: string, payloadText: string) {
        super(payloadText);
        this.path = path;
    }

    getConfigPath(): string {
        return this.path;
    }
}
