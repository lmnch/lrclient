import PayloadType from "./PayloadType";
import Variable from "../variables/Variable";

export default interface Payload {

    /**
     * Generates a body for request from a variable scope
     * 
     * @param variableScope scope to replace variables used in payload
     */
    getBody(variableScope: { [key: string]: Variable }): Promise<BodyInit | null>;

    
    getContentTypeHeader(): string;
    
    /**
     * Returns the payload in a type specific form for further scripting (without variable replacement)
     */
    getData(): Promise<any>;
    
    /**
     * Returns the raw (not resolved data) but maybe formatted (depends).
     */
    getRawData(formatted: boolean): Promise<string>;

    /**
     * Setter for updating the data of a payload. 
     * 
     * @param rawData raw data that should be parsed
     */
    setRawData(rawData: string): void;
}