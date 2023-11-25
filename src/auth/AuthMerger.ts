import { Endpoint, Environment } from "../model";
import Auth from "./Auth";
import AuthBasic from "./AuthBasic";
import AuthOAuth2 from "./AuthOAuth2";
import AuthType from "./AuthType";

export default class AuthMerger {
    /**
     * Merges the different authorizations defined in endpoint and environment together.
     * The endpoint has priority. If the type of the authorizations is the same, they are merged internally.
     */
    static mergeAuth(
        endpoint: Endpoint,
        environment: Environment
    ): Auth | undefined {
        return this.mergeAuthorizations(endpoint.auth, environment.auth);
    }

    /**
     * Merges a list of auths together. First one has highest overwrites second one, second one third one, ...
     */
    static mergeAuthorizations(
        ...authorizations: (Auth | undefined)[]
    ): Auth | undefined {
        const reversed: (Auth | undefined)[] = authorizations.reverse();
        let b: Auth | undefined = reversed[0];
        for (const a of reversed) {
            if (!b) {
                b = a;
                continue;
            }
            if (!a) {
                continue;
            }
            // If types are equal, they can be merged
            if (a.getAuthType() == b.getAuthType()) {
                switch (a.getAuthType()) {
                    case AuthType.OAUTH2:
                        b = this.#mergeOAuth2(a as AuthOAuth2, b as AuthOAuth2);
                        break;
                    case AuthType.BASIC:
                        b = this.#mergeBasic(a as AuthBasic, b as AuthBasic);
                        break;
                }
            } else {
                b = a;
            }
        }
        return b;
    }

    static #mergeOAuth2(...authorizations: AuthOAuth2[]): AuthOAuth2 {
        return this.#mergeAuthTyped(
            (a, b) =>
                new AuthOAuth2(
                    a.clientId || b.clientId,
                    a.clientSecret || b.clientSecret,
                    a.tokenHost || b.tokenHost,
                    a.tokenPath || b.tokenPath,
                    a.refreshPath || b.refreshPath,
                    a.revokePath || b.revokePath,
                    a.scopes || b.scopes,
                    a.username || b.username,
                    a.password || b.password
                ),
            ...authorizations
        );
    }

    static #mergeBasic(...authorizations: AuthBasic[]): AuthBasic {
        return this.#mergeAuthTyped(
            (a, b) =>
                new AuthBasic(
                    a.username || b.username,
                    a.password || b.password
                ),
            ...authorizations
        );
    }

    static #mergeAuthTyped<T extends Auth>(
        merger: (a: T, b: T) => T,
        ...authorizations: T[]
    ): T {
        const reversed: T[] = authorizations.reverse().filter((a) => a);
        let b: T = reversed[0];
        for (const a of reversed) {
            b = merger(a, b);
        }
        return b;
    }
}
