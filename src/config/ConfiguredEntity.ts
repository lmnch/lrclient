/**
 * Interface for everything that is configured in a file.
 * Basically, only to get the file path to write it back to the file.
 */
export default interface ConfiguredEntity {
    /**
     * Returns the configuration path of the entity.
     */
    getConfigPath(): string
}
