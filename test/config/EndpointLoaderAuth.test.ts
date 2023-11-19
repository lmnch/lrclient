import { expect } from "chai";
import { loadEndpoint, AuthOAuth2, AuthType } from "../../src";

describe("OAuth2 Endpoint loading", () => {
    it("should load OAuth2 authentication correctly", async () => {
        const endpoint = await loadEndpoint(
            "./test/resources/endpoints/github/profile/get.json"
        );

        expect(endpoint).to.haveOwnProperty("auth");
        expect(endpoint.auth?.getAuthType()).to.eq(AuthType.OAUTH2);
        expect(endpoint.auth).to.haveOwnProperty("clientId", "github");
        expect(endpoint.auth).to.haveOwnProperty(
            "accessTokenUri",
            "https://auth.github.com/token"
        );
        expect(endpoint.auth).to.haveOwnProperty(
            "authorizationUri",
            "https://auth.github.com/auth"
        );
        expect(endpoint.auth).to.haveOwnProperty(
            "redirectUri",
            "https://www.github.{{topLevelDomain}}/{{username}}"
        );
        expect(endpoint.auth).to.haveOwnProperty("scopes").and.to.be.empty;
    });
});

describe("BasicAuth Endpoint loading", () => {
    it("should load Basic authentication correctly", async () => {
        const endpoint = await loadEndpoint(
            "./test/resources/endpoints/github/repos/new.json"
        );

        expect(endpoint).to.haveOwnProperty("auth");
        expect(endpoint.auth?.getAuthType()).to.eq(AuthType.BASIC);
        expect(endpoint.auth).to.haveOwnProperty("username", "lmnch");
        expect(endpoint.auth).to.haveOwnProperty(
            "password",
            "typescript(!)sucks"
        );
    });
});
