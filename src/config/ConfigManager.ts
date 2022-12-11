import * as fs from "fs/promises";
import { existsSync } from "fs";
import LRCConstants from "../LRCConstants";
import LRCConfig from "./LRCConfig";

/**
 * Can be used to manage the config for the rest client.
 */
export default class ConfigManager {

    configFilePath: string;

    constructor(configFilePath: string = LRCConstants.DEFAULT_CONFIG_FILE) {
        this.configFilePath = configFilePath;
    }

    /**
     * Loads the configuration from disk.
     * 
     * @returns the config which is stored at the passed path or an empty config
     */
    async loadConfig(): Promise<LRCConfig> {
        if (existsSync(this.configFilePath)) {
            const data = fs.readFile(this.configFilePath);
            return <LRCConfig>JSON.parse((await data).toString());
        }
        return new LRCConfig();
    }

    /**
     * Stores the passed configuration on disk.
     * 
     * @param config Config which should be stored
     */
    async storeConfig(config: LRCConfig): Promise<void> {
        await fs.writeFile(this.configFilePath, JSON.stringify(config));
    }
}