import EnvironmentConfig from "../config/EnvironmentConfig";
import * as fs from 'fs/promises';
import LRCConstants from "../LRCConstants";
import Environment from "../model/Environment";

export async function loadEnv(envPath: string): Promise<Environment> {
    const data = await fs.readFile(envPath);
    return EnvironmentConfig.toEnvironment(<EnvironmentConfig>JSON.parse(data.toString()));
}
