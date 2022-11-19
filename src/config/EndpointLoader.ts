import LRCConstants from "../LRCConstants";
import Endpoint from "../model/Endpoint";
import * as fs from 'fs/promises';
import EndpointConfig from "./EndpointConfig";


export default async function loadEndpoint(endpointPath: string): Promise<Endpoint> {
    const data = await fs.readFile(endpointPath);
    return EndpointConfig.toEndpoint(<EndpointConfig>JSON.parse(data.toString()));
}