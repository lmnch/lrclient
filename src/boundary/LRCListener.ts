import LRCRequest from "../model/LRCRequest";
import LRCResponse from "../model/LRCResponse";

export default interface LRCListener {
    /**
     * Is called directly after a request was sent.
     *
     * @param request
     */
    onRequestSent(request: LRCRequest): void;

    /**
     * Is called when a request was responded.
     *
     * @param response
     */
    onResponseReceived(response: LRCResponse): void;
}
