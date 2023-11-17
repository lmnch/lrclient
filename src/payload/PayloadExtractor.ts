import Payload from "./Payload";

/**
 * Extracts the payload from a response of a REST call
 */
export default abstract class PayloadExtractor {
  successor: PayloadExtractor | undefined;

  extractIfPossible(response: Response): Promise<Payload> {
      const contentType = response.headers.get("Content-Type");
      if (this.canHandle(contentType)) {
          return this.extractResult(response);
      }
      if (!this.successor) {
          return new Promise((res, rej) =>
              rej(new Error("No payload handler found for " + contentType)),
          );
      }
      return this.successor.extractIfPossible(response);
  }

  abstract extractResult(arg0: Response): Promise<Payload>;

  abstract canHandle(contentType: string | null): boolean;
}
