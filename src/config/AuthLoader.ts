import Auth from "../auth/Auth";
import AuthBasic from "../auth/AuthBasic";
import AuthOAuth2 from "../auth/AuthOAuth2";
import AuthType from "../auth/AuthType";

export class AuthConfig {
    authType: string | undefined;

    // OAauth2
    clientId?: string;
    clientSecret?: string;
    tokenHost?: string;
    tokenPath?: string;
    refreshPath?: string;
    revokePath?: string;
    scopes?: string[];

    // Basic auth and OAauht2
    username?: string;
    password?: string;

    static fromAuth(a: Auth): AuthConfig {
        const authType = a.getAuthType();
        const config: AuthConfig = { ...a, authType: authType.toString() };
        return config;
    }

    static toAuth(c: AuthConfig): Auth {
        const authTypeString: string = this.nullCheck(
            undefined,
            "authType",
            c.authType
        );
        switch (authTypeString) {
            case AuthType.OAUTH2.toString():
                return new AuthOAuth2(
                    c.clientId,
                    c.clientSecret,
                    c.tokenHost,
                    c.tokenPath,
                    c.refreshPath,
                    c.revokePath,
                    c.scopes,
                    c.username,
                    c.password
                );
            case AuthType.BASIC.toString():
                return new AuthBasic(c.username, c.password);
        }
        throw new Error(`Unknown auth type: ${authTypeString}`);
    }

    private static nullCheck<T>(
        authType: string | undefined,
        fieldName: string,
        value: T | undefined
    ): T {
        if (!value) {
            throw new Error(
                `ConfigError: ${fieldName} shouldn't be null for type ${authType}`
            );
        }
        return value;
    }
}
