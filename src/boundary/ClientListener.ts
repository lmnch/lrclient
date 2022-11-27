import Endpoint from "../model/Endpoint";
import HttpMethod from "../model/HttpMethod";


export default interface ClientListener {

    onRequestSent: (request: Request);

}