import EnvironmentConfig from "../model/EnvironmentConfig";
import * as fs from 'fs/promises';
import LRCConstants from "../LRCConstants";
import Environment from "../model/Environment";

export async function loadEnv(envKey: string): Promise<Environment> {
    const data = await fs.readFile(LRCConstants.ENV_DIR_PATH + "/" + envKey + ".json");
    return EnvironmentConfig.toEnvironment(<EnvironmentConfig>JSON.parse(data.toString()));
}
