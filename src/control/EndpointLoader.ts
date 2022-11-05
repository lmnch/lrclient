import LRCConstants from "../LRCConstants";
import Endpoint from "../model/Endpoint";
import * as fs from 'fs/promises';
import EndpointConfig from "../model/EndpointConfig";


export default async function loadEndpoint(endpointPath:string): Promise<Endpoint>{
    const data = await fs.readFile(LRCConstants.ENDPOINT_DIR_PATH + "/" + endpointPath + ".json");
    return EndpointConfig.toEndpoint(<EndpointConfig>JSON.parse(data.toString())); 
}