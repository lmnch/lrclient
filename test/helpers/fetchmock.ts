/**
 * Checks if a object matches to a assertion
 */
export interface CallAssertion<T> {
    matches(param: T): boolean
}

export class Eq<T> implements CallAssertion<T | undefined> {
    #expected: T | undefined;

    constructor(expected: T | undefined) {
        this.#expected = expected;
    }

    matches(param: T | undefined): boolean {
        return this.#expected === param;
    }
}

export class Contains<V> implements CallAssertion<{ [key: string]: V }> {
    #keyMatcher: Eq<string>;
    #valueMatcher: Eq<V>;

    constructor(expectedKey: string, expectedValue: V) {
        this.#keyMatcher = new Eq(expectedKey);
        this.#valueMatcher = new Eq(expectedValue);
    }

    matches(param: { [key: string]: V }): boolean {
        return Object.entries(param).some(
            ([key, value]) =>
                this.#keyMatcher.matches(key) &&
                this.#valueMatcher.matches(value)
        );
    }
}

export class ContainsAll<V> implements CallAssertion<{ [key: string]: V }> {
    #containMatchers: Contains<V>[];

    constructor(expected: { [key: string]: V }) {
        this.#containMatchers = [];
        for (const [key, value] of Object.entries(expected)) {
            this.#containMatchers.push(new Contains(key, value));
        }
    }

    matches(param: { [key: string]: V }): boolean {
        return this.#containMatchers.every((matcher) => matcher.matches(param));
    }
}

export class Any<T> implements CallAssertion<T> {
    matches(): boolean {
        return true;
    }
}

export class FetchCallAssertions
implements CallAssertion<[RequestInfo | URL, RequestInit?]>
{
    resource: CallAssertion<RequestInfo | URL | string> = new Any();
    method: CallAssertion<string | undefined> = new Any();
    queryParams: CallAssertion<URLSearchParams> = new Any();
    headerParams: CallAssertion<{ [key: string]: string }> = new Any();
    payloadParams: CallAssertion<any> = new Any();

    matches([resource, reqInit]: [RequestInfo | URL, RequestInit?]): boolean {
        let method: string | undefined;
        const headers: { [key: string]: string } = {};
        if (reqInit) {
            method = reqInit.method;
            if (reqInit.headers) {
                for (const [key, value] of Object.entries(reqInit.headers)) {
                    headers[key] = value;
                }
            }
        }

        const [, queryParamString] = resource.toString().split("?");
        const queryParams = new URLSearchParams(queryParamString);

        return (
            this.resource.matches(resource) &&
            this.method.matches(method) &&
            this.headerParams.matches(headers) &&
            this.queryParams.matches(queryParams) &&
            this.payloadParams.matches(reqInit?.body)
        );
    }
}

const fetchMock = (callAssertions: FetchCallAssertions, response: Response) => {
    // Create a handler that retuns a response or null if it handles the request
    return (
        resource: RequestInfo | URL,
        init: RequestInit | undefined
    ): Promise<Response> | undefined => {
        if (!callAssertions.matches([resource, init])) {
            return undefined;
        }

        // If everything matches, we return the response
        return Promise.resolve(response);
    };
};

// Could be done better!
const registeredMocks: ((
    resource: RequestInfo | URL,
    options: RequestInit | undefined
) => Promise<Response> | undefined)[] = [];

export function mock(
    requestParams: FetchCallAssertions,
    response: Response
): void {
    registeredMocks.push(fetchMock(requestParams, response));
}

export function clearMocks(): void {
    while (registeredMocks.length > 0) {
        registeredMocks.pop();
    }
}

global.fetch = (
    resource: RequestInfo | URL,
    init: RequestInit | undefined
): Promise<Response> => {
    for (const handler of registeredMocks) {
        const result = handler(resource, init);
        if (result) {
            return result;
        }
    }

    throw new Error("Resource not mocked!");
};
