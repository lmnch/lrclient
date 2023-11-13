export default class LRCConstants {
    static get ENV_LRC_CONFIG_FILE(): string {
        return "LRC_CONFIG_FILE";
    }
    static get DEFAULT_CONFIG_FILE(): string {
        return "./.config";
    }
    static get TEMP_DOWNLOAD_FILE(): string {
        return "./out.pdf";
    }
}
