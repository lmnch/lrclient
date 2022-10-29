import VariableManager from "../control/VariableManager";


export default class Environment {

    headers: {[header: string]: string};

    variableScope: VariableManager;

    constructor(headers:{[header: string]: string}, vm: VariableManager){
        this.headers = headers;
        this.variableScope = vm;
    }

}