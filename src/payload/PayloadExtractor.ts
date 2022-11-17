import Payload from "./Payload";

export default  interface PayloadExtractor {

     extractResult: (arg0: Response) => Promise<Payload>;
     
}
