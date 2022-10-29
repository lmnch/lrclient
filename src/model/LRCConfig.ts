

export default class LRCConfig {

    selectedEnvironment: string | null = null;

    static toString(c : LRCConfig): string {
        return `LRCConfig ⚙️\n🌲 Selected Environment: ${c.selectedEnvironment}`;
    }
}