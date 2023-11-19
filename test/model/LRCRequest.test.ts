import {
    mock,
    FetchCallAssertions,
    Eq,
    ContainsAll,
    clearMocks,
} from "./../helpers/fetchmock";
import { HttpMethod, LRCRequest } from "../../src/index";
import chaiAsPromised from "chai-as-promised";
import chai, { expect } from "chai";

chai.use(chaiAsPromised);

describe("GET requests", () => {
    it("should send GET request and receive result 200", () => {
        const url =
            "https://github.com/search?q=repo%3Almnch%2Flrclient%20test&type=code";
        const method: HttpMethod = HttpMethod.GET;
        const headers: { [key: string]: string } = {
            Authorization: "Basic abc",
            Connection: "keep-alive",
        };

        const responseStatus = 200;
        const responseBody = "Hello world";

        const call = new FetchCallAssertions();
        call.method = new Eq(method);
        call.resource = new Eq<RequestInfo | URL | string>(url);
        call.headerParams = new ContainsAll(headers);

        mock(call, new Response(responseBody, { status: responseStatus }));

        // Test
        const target = new LRCRequest(method, url, headers);

        return Promise.all([
            expect(target.fetch()).to.be.fulfilled,
            expect(target.fetch()).to.eventually.have.property(
                "status",
                responseStatus
            ),
            target
                .fetch()
                .then((resp) => resp.text())
                .then((resp) => expect(resp).to.eq(responseBody)),
        ]);
    });

    it("should send GET request and receive result 400", () => {
        const url =
            "https://github.com/search?q=repo%3Almnch%2Flrclient%20test&type=code";
        const method: HttpMethod = HttpMethod.GET;
        const headers: { [key: string]: string } = {
            Authorization: "Basic abc",
            Connection: "keep-alive",
        };

        const responseStatus = 400;
        const responseBody = "Error";

        const call = new FetchCallAssertions();
        call.method = new Eq(method);
        call.resource = new Eq<RequestInfo | URL | string>(url);
        call.headerParams = new ContainsAll(headers);

        mock(call, new Response(responseBody, { status: responseStatus }));

        // Test
        const target = new LRCRequest(method, url, headers);

        target.fetch();
        return Promise.all([
            expect(target.fetch()).to.eventually.be.rejectedWith("400"),
        ]);
    });

    afterEach(() => {
        clearMocks();
    });
});
