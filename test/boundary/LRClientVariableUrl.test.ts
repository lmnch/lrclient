import { expect } from "chai";
import { ConfigManager, LRCLoggerConfig, LRClient } from "../../src";
import {
    Eq,
    FetchCallAssertions,
    Mock,
    clearMocks,
    mock,
} from "../helpers/fetchmock";

const testConfig = "./test/resources/testconfig.json";

describe("Variable replacement in URLs", () => {
    let mockLmnch: Mock;
    let mockLukas: Mock;
    let mockDotDev: Mock;

    beforeEach(() => {
        const capturesLmnch = new FetchCallAssertions();
        capturesLmnch.resource = new Eq<RequestInfo | URL>(
            "https://www.github.com/lmnch"
        );
        const respLmnch = new Response(
            JSON.stringify({ username: "lmnch", password: "password" }),
            { headers: { "Content-Type": "application/json" } }
        );
        mockLmnch = mock(capturesLmnch, respLmnch);

        const capturesLukas = new FetchCallAssertions();
        capturesLukas.resource = new Eq<RequestInfo | URL>(
            "https://www.github.com/xXx_LUKAS_D3STR0Y3R_xXx"
        );
        const respLukas = new Response(
            JSON.stringify({
                username: "xXx_LUKAS_D3STR0Y3R_xXx",
                password: "bigdenergy",
            }),
            { headers: { "Content-Type": "application/json" } }
        );
        mockLukas = mock(capturesLukas, respLukas);

        const capturesDotDev = new FetchCallAssertions();
        capturesDotDev.resource = new Eq<RequestInfo | URL>(
            "https://www.github.dev/lmnch"
        );
        const respDotDev = new Response(JSON.stringify({ dev: true }), {
            headers: { "Content-Type": "application/json" },
        });
        mockDotDev = mock(capturesDotDev, respDotDev);
    });

    it("should use variable from endpoint", async () => {
        const target = new LRClient(
            new LRCLoggerConfig({}),
            new ConfigManager(testConfig)
        );
        await target.init();

        const response: any = await target.send(
            "./test/resources/endpoints/github/profile/get.json"
        );

        expect(response).to.haveOwnProperty("username", "lmnch");
        expect(response).to.haveOwnProperty("password", "password");

        expect(mockLmnch.counter).to.eq(1);
        expect(mockLukas.counter).to.eq(0);
        expect(mockDotDev.counter).to.eq(0);
    });

    it("should overwrite variable from endpoint with new value", async () => {
        const target = new LRClient(
            new LRCLoggerConfig({}),
            new ConfigManager(testConfig)
        );
        await target.init();

        // Overwrite varaiable value
        const response: any = await target.send(
            "./test/resources/endpoints/github/profile/get.json",
            { username: "xXx_LUKAS_D3STR0Y3R_xXx" }
        );

        expect(response).to.haveOwnProperty(
            "username",
            "xXx_LUKAS_D3STR0Y3R_xXx"
        );
        expect(response).to.haveOwnProperty("password", "bigdenergy");

        expect(mockLmnch.counter).to.eq(0);
        expect(mockLukas.counter).to.eq(1);
        expect(mockDotDev.counter).to.eq(0);
    });

    it("should overwrite environment variable", async () => {
        const target = new LRClient(
            new LRCLoggerConfig({}),
            new ConfigManager(testConfig)
        );
        await target.init();

        // Overwrite varaiable value
        const response: any = await target.send(
            "./test/resources/endpoints/github/profile/get.json",
            { topLevelDomain: "dev" }
        );

        expect(response).to.haveOwnProperty("dev", true);

        expect(mockLmnch.counter).to.eq(0);
        expect(mockLukas.counter).to.eq(0);
        expect(mockDotDev.counter).to.eq(1);
    });

    afterEach(() => {
        clearMocks();
    });
});
