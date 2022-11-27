import fetch from "node-fetch";
import HttpMethod from "./HttpMethod";


export default class Request {

    method: HttpMethod;
    url: string;
    headers: { [key: string]: string };
    body: BodyInit | null;

    constructor(method: HttpMethod, url: string, headers: { [key: string]: string }, body: BodyInit | null) {
        this.method = method;
        this.url = url;
        this.headers = headers;
        this.body = body;
    }

    async fetch() {
        return await fetch(this.url, {
            method: HttpMethod[this.method],
            headers: this.headers, body: this.body})
    }
}