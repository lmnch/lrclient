import { expect } from "chai";
import { ConfigManager, LRCLoggerConfig, LRClient } from "../../src";
import {
    ContainsAll,
    Eq,
    FetchCallAssertions,
    Mock,
    clearMocks,
    mock,
} from "../helpers/fetchmock";

const testConfig = "./test/resources/testconfig.json";

describe("Variable replacement in headers", () => {
    let mockKeepAlive: Mock;
    let mockClose: Mock;
    let mockFirefox: Mock;

    beforeEach(() => {
        const capturesKeepAlive = new FetchCallAssertions();
        capturesKeepAlive.resource = new Eq<RequestInfo | URL>(
            "https://www.github.com/lmnch"
        );
        capturesKeepAlive.headerParams = new ContainsAll({
            Connection: "keep-alive",
            "User-Agent": "lrclient",
        });
        const respKeepAlive = new Response(
            JSON.stringify({ username: "lmnch", password: "password" }),
            { headers: { "Content-Type": "application/json" } }
        );
        mockKeepAlive = mock(capturesKeepAlive, respKeepAlive);

        const capturesClose = new FetchCallAssertions();
        capturesClose.resource = new Eq<RequestInfo | URL>(
            "https://www.github.com/lmnch"
        );
        capturesClose.headerParams = new ContainsAll({
            Connection: "close",
            "User-Agent": "lrclient",
        });
        const respClose = new Response(JSON.stringify({ dev: true }), {
            headers: { "Content-Type": "application/json" },
        });
        mockClose = mock(capturesClose, respClose);

        const capturesFirefox = new FetchCallAssertions();
        capturesFirefox.resource = new Eq<RequestInfo | URL>(
            "https://www.github.com/lmnch"
        );
        capturesFirefox.headerParams = new ContainsAll({
            Connection: "close",
            "User-Agent": "Firefox",
        });
        const respFirefox = new Response(JSON.stringify({ dev: true }), {
            headers: { "Content-Type": "application/json" },
        });
        mockFirefox = mock(capturesFirefox, respFirefox);
    });

    it("should use variable from endpoint", async () => {
        const target = new LRClient(
            new LRCLoggerConfig({}),
            new ConfigManager(testConfig)
        );
        await target.init();

        await target.send("./test/resources/endpoints/github/profile/get.json");

        expect(mockKeepAlive.counter).to.eq(1);
        expect(mockClose.counter).to.eq(0);
        expect(mockFirefox.counter).to.eq(0);
    });

    it("should overwrite variable from endpoint with new value", async () => {
        const target = new LRClient(
            new LRCLoggerConfig({}),
            new ConfigManager(testConfig)
        );
        await target.init();

        // Overwrite varaiable value
        await target.send(
            "./test/resources/endpoints/github/profile/get.json",
            {
                connection: "close",
            }
        );

        expect(mockKeepAlive.counter).to.eq(0);
        expect(mockClose.counter).to.eq(1);
        expect(mockFirefox.counter).to.eq(0);
    });

    it("should overwrite environment variable", async () => {
        const target = new LRClient(
            new LRCLoggerConfig({}),
            new ConfigManager(testConfig)
        );
        await target.init();

        // Overwrite varaiable value
        await target.send(
            "./test/resources/endpoints/github/profile/get.json",
            {
                userAgent: "Firefox",
                connection: "close",
            }
        );

        expect(mockKeepAlive.counter).to.eq(0);
        expect(mockClose.counter).to.eq(0);
        expect(mockFirefox.counter).to.eq(1);
    });

    afterEach(() => {
        clearMocks();
    });
});
