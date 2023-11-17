import { expect } from "chai";
import { ConfigManager, LRCLoggerConfig, LRClient } from "../../src";
import {
    And,
    Eq,
    FetchCallAssertions,
    Mock,
    StringContains,
    clearMocks,
    mock,
} from "../helpers/fetchmock";

const testConfig = "./test/resources/testconfig.json";

describe("Variable replacement in JSON payloads", () => {
    let mockCool: Mock;
    let mockDump: Mock;
    let mockCompanyOverwrite: Mock;

    beforeEach(() => {
        const capturesCool = new FetchCallAssertions();
        capturesCool.resource = new Eq<RequestInfo | URL>(
            "https://www.github.com/lmnch/repos",
        );
        capturesCool.method = new Eq("POST");
        capturesCool.payloadParams = new And(
            new StringContains("cool"),
            new StringContains("company_test123"),
        );
        const respCool = new Response(
            JSON.stringify({ repoName: "lrclient", sucessful: true }),
            { headers: { "Content-Type": "application/json" } },
        );
        mockCool = mock(capturesCool, respCool);

        const capturesDump = new FetchCallAssertions();
        capturesDump.resource = new Eq<RequestInfo | URL>(
            "https://www.github.com/lmnch/repos",
        );
        capturesDump.method = new Eq("POST");
        capturesDump.payloadParams = new And(
            new StringContains("dump"),
            new StringContains("company_test123"),
        );
        const respDump = new Response(
            JSON.stringify({ repoName: "lrclient", sucessful: false }),
            { headers: { "Content-Type": "application/json" } },
        );
        mockDump = mock(capturesDump, respDump);

        const capturesCompanyOverwrite = new FetchCallAssertions();
        capturesCompanyOverwrite.resource = new Eq<RequestInfo | URL>(
            "https://www.github.com/lmnch/repos",
        );
        capturesCompanyOverwrite.method = new Eq("POST");
        capturesCompanyOverwrite.payloadParams = new StringContains(
            "company_test_4444",
        );
        const respCompanyOverwrite = new Response(
            JSON.stringify({ repoName: "lrclient", sucessful: true }),
            { headers: { "Content-Type": "application/json" } },
        );
        mockCompanyOverwrite = mock(capturesCompanyOverwrite, respCompanyOverwrite);
    });

    it("should use endpoint variable in payload", async () => {
        const target = new LRClient(
            new LRCLoggerConfig({}),
            new ConfigManager(testConfig),
        );
        await target.init();

        const response: any = await target.send(
            "./test/resources/endpoints/github/repos/new.json",
        );

        expect(response).to.haveOwnProperty("sucessful", true);

        expect(mockCool.counter).to.eq(1);
        expect(mockDump.counter).to.eq(0);
        expect(mockCompanyOverwrite.counter).to.eq(0);
    });

    it("should overwrite endpoint variable in payload", async () => {
        const target = new LRClient(
            new LRCLoggerConfig({}),
            new ConfigManager(testConfig),
        );
        await target.init();

        const response: any = await target.send(
            "./test/resources/endpoints/github/repos/new.json",
            { quality: "dump" },
        );

        // We expect passed var quality=dump to be used
        // => dump response to be returned
        expect(response).to.haveOwnProperty("sucessful", false);

        expect(mockCool.counter).to.eq(0);
        expect(mockDump.counter).to.eq(1);
        expect(mockCompanyOverwrite.counter).to.eq(0);
    });

    it("should overwrite environment variable in payload", async () => {
        const target = new LRClient(
            new LRCLoggerConfig({}),
            new ConfigManager(testConfig),
        );
        await target.init();

        await target.send("./test/resources/endpoints/github/repos/new.json", {
            group: "company_test_4444",
        });

        expect(mockCool.counter).to.eq(0);
        expect(mockDump.counter).to.eq(0);
        expect(mockCompanyOverwrite.counter).to.eq(1);
    });

    afterEach(() => {
        clearMocks();
    });
});
