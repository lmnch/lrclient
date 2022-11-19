
import PayloadType from "../model/PayloadType";
import Payload from "./Payload";
import PayloadExtractor from "./PayloadExtractor";
import PayloadJson from "./PayloadJson";
import PayloadText from "./PayloadText";



class JsonPayloadExtractor implements PayloadExtractor {
    async extractResult(response: Response): Promise<Payload> {
        return new PayloadJson(await response.json());
    }
}

class TextPayloadExtractor implements PayloadExtractor {
    async extractResult(arg0: Response): Promise<Payload> {
        return new PayloadText(await arg0.text());
    }

}

const supportedResultExtractors: { [key: string]: PayloadExtractor } = {};
supportedResultExtractors[PayloadType.APPLICATION_JSON] = new JsonPayloadExtractor();
supportedResultExtractors[PayloadType.APPLICATION_TEXT] = new TextPayloadExtractor();

/**
 * Contains extractors for different PayloadTypes
 */
export default supportedResultExtractors;