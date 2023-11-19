import { expect } from "chai";
import {
    Auth,
    AuthMerger,
    AuthOAuth2,
    AuthType,
    Endpoint,
    Environment,
    HttpMethod,
    Variable,
    VariableManager,
} from "../../src";
import AuthBasic from "../../src/auth/AuthBasic";

function createEndpoint(auth: Auth | undefined): Endpoint {
    return new Endpoint(
        new Variable("url", "url"),
        HttpMethod.GET,
        {},
        new VariableManager({}),
        auth,
        undefined
    );
}

function createEnvironment(auth: Auth | undefined): Environment {
    return new Environment({}, new VariableManager({}), auth);
}

describe("Merge auths of same type (OAUTH2)", () => {
    it("should take endpoint auth if not set on env", () => {
        const environment = createEnvironment(undefined);
        const endpoint = createEndpoint(
            new AuthOAuth2(
                "github",
                "github@123",
                "http://auth.github.com",
                undefined,
                undefined,
                undefined,
                ["repos"],
                "lmnch",
                "lmnch@123"
            )
        );

        const resulting = AuthMerger.mergeAuth(
            endpoint,
            environment
        ) as AuthOAuth2;

        expect(resulting.clientId).to.eq("github");
        expect(resulting.clientSecret).to.eq("github@123");
        expect(resulting.tokenHost).to.eq("http://auth.github.com");
        expect(resulting.scopes).to.have.length(1);
        expect(resulting.scopes).to.contain("repos");
        expect(resulting.username).to.eq("lmnch");
        expect(resulting.password).to.eq("lmnch@123");
    });

    it("should take environment auth if not set on endpoint", () => {
        const environment = createEnvironment(
            new AuthOAuth2(
                "github",
                "github@123",
                "http://auth.github.com",
                undefined,
                undefined,
                undefined,
                ["repos"],
                "lmnch",
                "lmnch@123"
            )
        );
        const endpoint = createEndpoint(undefined);

        const resulting = AuthMerger.mergeAuth(
            endpoint,
            environment
        ) as AuthOAuth2;

        expect(resulting.clientId).to.eq("github");
        expect(resulting.clientSecret).to.eq("github@123");
        expect(resulting.tokenHost).to.eq("http://auth.github.com");
        expect(resulting.scopes).to.have.length(1);
        expect(resulting.scopes).to.contain("repos");
        expect(resulting.username).to.eq("lmnch");
        expect(resulting.password).to.eq("lmnch@123");
    });

    it("should take overwrite scope in endpoint", () => {
        const environment = createEnvironment(
            new AuthOAuth2(
                "github",
                "github@123",
                "http://auth.github.com",
                undefined,
                undefined,
                undefined,
                ["repos"],
                "lmnch",
                "lmnch@123"
            )
        );
        const endpoint = createEndpoint(
            new AuthOAuth2(
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                ["account"],
                undefined,
                undefined
            )
        );

        const resulting = AuthMerger.mergeAuth(
            endpoint,
            environment
        ) as AuthOAuth2;

        expect(resulting.scopes).to.have.length(1);
        expect(resulting.scopes).to.contain("account");
    });

    it("should set unset client secret in endpoint", () => {
        const environment = createEnvironment(
            new AuthOAuth2(
                "github",
                undefined,
                "http://auth.github.com",
                undefined,
                undefined,
                undefined,
                ["repos"],
                "lmnch",
                "lmnch@123"
            )
        );
        const endpoint = createEndpoint(
            new AuthOAuth2(
                undefined,
                "test_secret",
                undefined,
                undefined,
                undefined,
                undefined,
                ["account"],
                undefined,
                undefined
            )
        );

        const resulting = AuthMerger.mergeAuth(
            endpoint,
            environment
        ) as AuthOAuth2;

        expect(resulting.clientSecret).to.eq("test_secret");
    });
});

describe("Merge auths of same type (BASIC)", () => {
    it("should take endpoint auth if not set on env", () => {
        const environment = createEnvironment(undefined);
        const endpoint = createEndpoint(new AuthBasic("lmnch", "lmnch@123"));

        const resulting = AuthMerger.mergeAuth(
            endpoint,
            environment
        ) as AuthBasic;

        expect(resulting.username).to.eq("lmnch");
        expect(resulting.password).to.eq("lmnch@123");
    });

    it("should take environment auth if not set on endpoint", () => {
        const environment = createEnvironment(
            new AuthBasic("lmnch", "lmnch@123")
        );
        const endpoint = createEndpoint(undefined);

        const resulting = AuthMerger.mergeAuth(
            endpoint,
            environment
        ) as AuthBasic;

        expect(resulting.username).to.eq("lmnch");
        expect(resulting.password).to.eq("lmnch@123");
    });

    it("should take overwrite scope in endpoint", () => {
        const environment = createEnvironment(
            new AuthBasic("lmnch", "lmnch@123")
        );
        const endpoint = createEndpoint(
            new AuthBasic(undefined, "test_password")
        );

        const resulting = AuthMerger.mergeAuth(
            endpoint,
            environment
        ) as AuthBasic;

        expect(resulting.password).to.contain("test_password");
    });

    it("should set unset client secret in endpoint", () => {
        const environment = createEnvironment(
            new AuthBasic("lmnch", undefined)
        );
        const endpoint = createEndpoint(
            new AuthBasic(undefined, "test_password")
        );

        const resulting = AuthMerger.mergeAuth(
            endpoint,
            environment
        ) as AuthBasic;

        expect(resulting.password).to.eq("test_password");
    });
});

describe("Try merging auths of different types", () => {
    it("should overwrite environtment auth (OAUTH2) with endpoint auth (BASIC)", () => {
        const environment = createEnvironment(
            new AuthOAuth2(
                "github",
                "github@123",
                "http://auth.github.com",
                undefined,
                undefined,
                undefined,
                ["repos"],
                "lmnch",
                "lmnch@123"
            )
        );
        const endpoint = createEndpoint(
            new AuthBasic("lukas", "test_password")
        );

        const resulting = AuthMerger.mergeAuth(endpoint, environment);

        expect(resulting?.getAuthType()).to.eq(AuthType.BASIC);
        expect((resulting as AuthBasic).username).to.eq("lukas");
        expect((resulting as AuthBasic).password).to.eq("test_password");
    });

    it("should overwrite environtment auth (BAISC) with endpoint auth (OAUTH2)", () => {
        const environment = createEnvironment(
            new AuthBasic("lukas", "test_password")
        );
        const endpoint = createEndpoint(
            new AuthOAuth2(
                "github",
                "github@123",
                "http://auth.github.com",
                undefined,
                undefined,
                undefined,
                ["repos"],
                "lmnch",
                "lmnch@123"
            )
        );

        const resulting = AuthMerger.mergeAuth(endpoint, environment);

        expect((resulting as AuthOAuth2).clientId).to.eq("github");
        expect((resulting as AuthOAuth2).clientSecret).to.eq("github@123");
        expect((resulting as AuthOAuth2).tokenHost).to.eq(
            "http://auth.github.com"
        );
        expect((resulting as AuthOAuth2).scopes).to.have.length(1);
        expect((resulting as AuthOAuth2).scopes).to.contain("repos");
        expect((resulting as AuthOAuth2).username).to.eq("lmnch");
        expect((resulting as AuthOAuth2).password).to.eq("lmnch@123");
    });
});
