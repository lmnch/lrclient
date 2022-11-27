import Endpoint from "../model/Endpoint";
import HttpMethod from "../model/HttpMethod";
import LRCRequest from "../model/LRCRequest";
import LRCResponse from "../model/LRCResponse";

export default interface LRCListener {

    onRequestSent(request: LRCRequest): void;

    onResponseReceived(response: LRCResponse): void;

}