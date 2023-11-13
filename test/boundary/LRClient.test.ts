import {ConfigManager, LRCLoggerConfig, LRClient} from "../../src";
import {FetchCallAssertions, mock} from "../helpers/fetchmock";


const testConfig = "./test/resources/testconfig.json";

describe("GET calls", () => {

    it("should use variable from endpoint", () => {
        const captures = new FetchCallAssertions()
        // mock(new FetchCallAssertions(), new Re)

        const target = new LRClient(new LRCLoggerConfig({}), new ConfigManager(testConfig));
    });

});
