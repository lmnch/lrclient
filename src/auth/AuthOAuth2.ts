import { AccessToken, ResourceOwnerPassword, Token } from "simple-oauth2";
import Auth from "./Auth";
import AuthType from "./AuthType";
import { LRCRequest } from "../model";
import { Variable } from "../variables";

export default class AuthOAuth2 implements Auth {
    #clientId: string | undefined;
    #clientSecret: string | undefined;
    #tokenHost: string | undefined;
    #tokenPath: string | undefined;
    #refreshPath: string | undefined;
    #revokePath: string | undefined;
    #scopes: string[] | undefined;
    #username: string | undefined;
    #password: string | undefined;

    #accessToken: AccessToken | undefined;

    constructor(
        clientId: string | undefined,
        clientSecret: string | undefined,
        tokenHost: string | undefined,
        tokenPath: string | undefined,
        refreshPath: string | undefined,
        revokePath: string | undefined,
        scopes: string[] | undefined,
        username: string | undefined,
        password: string | undefined
    ) {
        this.#clientId = clientId;
        this.#clientSecret = clientSecret;
        this.#tokenHost = tokenHost;
        this.#tokenPath = tokenPath;
        this.#refreshPath = refreshPath;
        this.#revokePath = revokePath;
        this.#scopes = scopes;
        this.#username = username;
        this.#password = password;
    }

    getAuthType(): AuthType {
        return AuthType.OAUTH2;
    }

    async sign(
        request: LRCRequest,
        variableStore: { [key: string]: Variable }
    ): Promise<LRCRequest> {
        const token = await this.#getToken(variableStore);

        const copy = request.clone();
        copy.headers[
            "Authorization"
        ] = `${token.token_type} ${token.access_token}`;
        return copy;
    }

    async #getToken(variableStore: {
        [key: string]: Variable;
    }): Promise<Token> {
        if (!this.#accessToken) {
            this.#accessToken = await this.#getNewToken(variableStore);
        } else if (this.#accessToken.expired()) {
            this.#accessToken = await this.#accessToken.refresh();
        }

        return this.#accessToken.token;
    }

    async #getNewToken(variableStore: {
        [key: string]: Variable;
    }): Promise<AccessToken> {
        const id = this.#clientId
            ? new Variable("clientId", this.#clientId).resolve(variableStore)
                  .value
            : undefined;
        const secret = this.#clientSecret
            ? new Variable("clientSecret", this.#clientSecret).resolve(
                  variableStore
              ).value
            : undefined;
        const tokenHost = this.#tokenHost
            ? new Variable("tokenHost", this.#tokenHost).resolve(variableStore)
                  .value
            : undefined;
        const tokenPath = this.#tokenPath
            ? new Variable("tokenPath", this.#tokenPath).resolve(variableStore)
                  .value
            : undefined;
        const refreshPath = this.#refreshPath
            ? new Variable("refreshPath", this.#refreshPath).resolve(
                  variableStore
              ).value
            : undefined;
        const revokePath = this.#revokePath
            ? new Variable("revokePath", this.#revokePath).resolve(
                  variableStore
              ).value
            : undefined;

        const config = {
            client: {
                id: id || "",
                secret: secret || "",
            },
            auth: {
                tokenHost: tokenHost || "",
                tokenPath,
                refreshPath,
                revokePath,
            },
        };

        const scopes = this.#scopes
            ? this.#scopes.map(
                  (scope, index) =>
                      new Variable(`${scope[index]}`, scope).resolve(
                          variableStore
                      ).value
              )
            : undefined;
        const username = this.#username
            ? new Variable("username", this.#username).resolve(variableStore)
                  .value
            : undefined;
        const password = this.#password
            ? new Variable("password", this.#password).resolve(variableStore)
                  .value
            : undefined;

        const client = new ResourceOwnerPassword(config);

        const tokenParams = {
            username: username || "",
            password: password || "",
            scopes,
        };

        return await client.getToken(tokenParams);
    }

    get clientId(): string | undefined {
        return this.#clientId;
    }

    get clientSecret(): string | undefined {
        return this.#clientSecret;
    }

    get tokenHost(): string | undefined {
        return this.#tokenHost;
    }

    get tokenPath(): string | undefined {
        return this.#tokenPath;
    }

    get refreshPath(): string | undefined {
        return this.#refreshPath;
    }

    get revokePath(): string | undefined {
        return this.#revokePath;
    }

    get scopes(): string[] | undefined {
        return this.#scopes;
    }

    get username(): string | undefined {
        return this.#username;
    }

    get password(): string | undefined {
        return this.#password;
    }
}
