import HttpMethod from "./HttpMethod";

/**
 * Should only contain teh resolved values.
 * These values will be directly send to the endpoint.
 */
export default class LRCRequest {
  method: HttpMethod;
  url: string;
  headers: { [key: string]: string };
  body: BodyInit | null | undefined;

  constructor(
      method: HttpMethod,
      url: string,
      headers: { [key: string]: string },
      body: BodyInit | null | undefined = undefined,
  ) {
      this.method = method;
      this.url = url;
      this.headers = headers;
      this.body = body;
  }

  async fetch(): Promise<Response> {
      const response = await fetch(this.url, {
          method: HttpMethod[this.method],
          headers: this.headers,
          body: this.body,
      });

      if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText}`);
      }

      return response;
  }
}
