import { LRCRequest } from "../model";
import { Variable } from "../variables";
import Auth from "./Auth";
import AuthType from "./AuthType";

export default class AuthBasic implements Auth {
    #username: string | undefined;
    #password: string | undefined;

    constructor(username: string | undefined, password: string | undefined) {
        this.#username = username;
        this.#password = password;
    }

    getAuthType(): AuthType {
        return AuthType.BASIC;
    }

    sign(
        request: LRCRequest,
        scope: { [key: string]: Variable }
    ): Promise<LRCRequest> {
        const username = this.#username
            ? new Variable("username", this.#username).resolve(scope).value
            : undefined;
        const password = this.#password
            ? new Variable("password", this.#password).resolve(scope).value
            : undefined;
        const copy = request.clone();
        copy.headers["Authorization"] = `Basic ${btoa(
            `${username}:${password}`
        )}`;
        return Promise.resolve(copy);
    }

    get username(): string | undefined {
        return this.#username;
    }

    get password(): string | undefined {
        return this.#password;
    }
}
