import { expect } from "chai";
import { loadEndpoint, AuthType, AuthOAuth2 } from "../../src";
import AuthBasic from "../../src/auth/AuthBasic";

describe("OAuth2 Endpoint loading", () => {
    it("should load OAuth2 authentication correctly", async () => {
        const endpoint = await loadEndpoint(
            "./test/resources/endpoints/github/groups/all.json"
        );

        expect(endpoint).to.haveOwnProperty("auth");
        expect(endpoint.auth?.getAuthType()).to.eq(AuthType.OAUTH2);
        expect((endpoint.auth as AuthOAuth2).clientId).to.eq("github");
        expect((endpoint.auth as AuthOAuth2).tokenHost).to.eq(
            "https://auth.github.com"
        );
        expect((endpoint.auth as AuthOAuth2).tokenPath).to.eq("token");
        expect((endpoint.auth as AuthOAuth2).scopes).to.be.empty;
    });
});

describe("BasicAuth Endpoint loading", () => {
    it("should load Basic authentication correctly", async () => {
        const endpoint = await loadEndpoint(
            "./test/resources/endpoints/github/repos/new.json"
        );

        expect(endpoint).to.haveOwnProperty("auth");
        expect(endpoint.auth?.getAuthType()).to.eq(AuthType.BASIC);
        expect((endpoint.auth as AuthBasic).username).to.eq("lmnch");
        expect((endpoint.auth as AuthBasic).password).to.eq(
            "typescript(!)sucks"
        );
    });
});
