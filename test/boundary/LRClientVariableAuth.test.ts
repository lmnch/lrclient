import { expect } from "chai";
import { ConfigManager, LRCLoggerConfig, LRClient } from "../../src";
import {
    Contains,
    FetchCallAssertions,
    Mock,
    clearMocks,
    mock,
} from "../helpers/fetchmock";

const testConfig = "./test/resources/testconfig.json";

describe("Variable replacement in authorization", () => {
    let mockLmnch: Mock;
    let mockLukas: Mock;
    let mockCustomPassword: Mock;

    beforeEach(() => {
        const capturesLmnch = new FetchCallAssertions();
        const authLmnch = btoa("lmnch:lmnch@123");
        capturesLmnch.headerParams = new Contains(
            "Authorization",
            `Basic ${authLmnch}`
        );
        mockLmnch = mock(capturesLmnch);
        console.log("Mocked for Authorization:", authLmnch);

        const capturesLukas = new FetchCallAssertions();
        const authLukas = btoa(
            "xXx_LUKAS_D3STR0Y3R_xXx:xXx_LUKAS_D3STR0Y3R_xXx@123"
        );
        capturesLukas.headerParams = new Contains(
            "Authorization",
            `Basic ${btoa(
                "xXx_LUKAS_D3STR0Y3R_xXx:xXx_LUKAS_D3STR0Y3R_xXx@123"
            )}`
        );
        mockLukas = mock(capturesLukas);
        console.log("Mocked for Authorization:", authLukas);

        const capturesCustomPassword = new FetchCallAssertions();
        const authCustomPassword = btoa("lmnch:secure_password");
        capturesCustomPassword.headerParams = new Contains(
            "Authorization",
            `Basic ${authCustomPassword}`
        );
        mockCustomPassword = mock(capturesCustomPassword);
        console.log("Mocked for Authorization:", authCustomPassword);
    });

    it("should use variable from endpoint", async () => {
        const target = new LRClient(
            new LRCLoggerConfig({}),
            new ConfigManager(testConfig)
        );
        await target.init();

        await target.send("./test/resources/endpoints/github/profile/me.json");

        expect(mockLmnch.counter).to.eq(1);
        expect(mockLukas.counter).to.eq(0);
        expect(mockCustomPassword.counter).to.eq(0);
    });

    it("should overwrite variable from endpoint with new value with consequences on other variable", async () => {
        const target = new LRClient(
            new LRCLoggerConfig({}),
            new ConfigManager(testConfig)
        );
        await target.init();

        // Overwrite varaiable value
        await target.send("./test/resources/endpoints/github/profile/me.json", {
            username: "xXx_LUKAS_D3STR0Y3R_xXx",
        });

        expect(mockLmnch.counter).to.eq(0);
        expect(mockLukas.counter).to.eq(1);
        expect(mockCustomPassword.counter).to.eq(0);
    });

    it("should overwrite variable from endpoint with new value", async () => {
        const target = new LRClient(
            new LRCLoggerConfig({}),
            new ConfigManager(testConfig)
        );
        await target.init();

        // Overwrite varaiable value
        await target.send("./test/resources/endpoints/github/profile/me.json", {
            password: "secure_password",
        });

        expect(mockLmnch.counter).to.eq(0);
        expect(mockLukas.counter).to.eq(0);
        expect(mockCustomPassword.counter).to.eq(1);
    });

    afterEach(() => {
        clearMocks();
    });
});
