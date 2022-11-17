import Variable from "../variables/Variable";


export default interface Payload {

    getBody(variableScope: { [key: string]: Variable }): Promise<BodyInit | null>;

    toString(): string;

}