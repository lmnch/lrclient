import Payload from "./Payload";

/**
 * Extracts the payload from a response of a REST call
 */
export default interface PayloadExtractor {

     extractResult: (arg0: Response) => Promise<Payload>;

}
