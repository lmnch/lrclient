import * as fs from "fs/promises";
import { existsSync } from "fs";
import LRCConstants from "../LRCConstants";
import LRCConfig from "../config/LRCConfig";

export async function loadConfig(): Promise<LRCConfig> {
    if (existsSync(LRCConstants.CONFIG_FILE)) {
        const data = fs.readFile(LRCConstants.CONFIG_FILE);
        return <LRCConfig>JSON.parse((await data).toString());
    }
    return new LRCConfig();
}


export async function storeConfig(config: LRCConfig): Promise<void> {
    await fs.writeFile(LRCConstants.CONFIG_FILE, JSON.stringify(config));
}