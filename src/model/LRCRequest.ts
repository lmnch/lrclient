
import HttpMethod from "./HttpMethod";

export default class LRCRequest {

    method: HttpMethod;
    url: string;
    headers: { [key: string]: string };
    body: BodyInit | null | undefined;

    constructor(method: HttpMethod, url: string, headers: { [key: string]: string }, body: BodyInit | null | undefined) {
        this.method = method;
        this.url = url;
        this.headers = headers;
        this.body = body;
    }

    async fetch(): Promise<Response> {
        return await fetch(this.url, {
            method: HttpMethod[this.method],
            headers: this.headers, body: this.body
        })
    }
}