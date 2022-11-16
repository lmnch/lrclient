import ResultType from "../model/ResultType";
import ResultExtractor from "./ResultExtractor";



class JsonResultExtractor implements ResultExtractor {
    async extractResult(response: Response) {
        return await response.json();
    }
}

const supportedResultExtractors: { [key: string]: ResultExtractor } = {};
supportedResultExtractors[ResultType.APPLICATION_JSON.toString()] = new JsonResultExtractor();


export default supportedResultExtractors;