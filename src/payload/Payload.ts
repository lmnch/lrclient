import Variable from "../variables/Variable";

export default interface Payload {

    /**
     * Generates a body for request from a variable scope
     * 
     * @param variableScope scope to replace variables used in payload
     */
    getBody(variableScope: { [key: string]: Variable }): Promise<BodyInit | null>;

    toString(): string;

    getContentTypeHeader(): string;

    /**
     * Returns the payload in a type specific form for further scripting (without variable replacement)
     */
    getData(): Promise<Variable>;

}