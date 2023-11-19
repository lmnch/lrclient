import { LRCRequest } from "../model";
import { Variable } from "../variables";
import AuthType from "./AuthType";

export default interface Auth {
    /**
     * Type of authentication
     **/
    getAuthType(): AuthType;

    /**
     * Signs a given request and returns the signed request
     *
     * @param Reqeust to be signed
     * @return signed request
     **/
    sign(
        request: LRCRequest,
        variableStore: { [key: string]: Variable }
    ): Promise<LRCRequest>;
}
