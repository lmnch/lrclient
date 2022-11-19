import Endpoint from "../model/Endpoint";
import Environment from "../model/Environment";
import Variable from "./Variable";
import VariableManager from "./VariableManager";

/**
 * Merges variables and headers together
 */
export default class VariableMerger {
    
    /**
     * Merges variables tother:
     * - localVariables overwrite
     * - endpoint variables overwrite
     * - environment variables
     * 
     * @param localVariables 
     * @param endpoint 
     * @param environment 
     * @returns 
     */
    static mergeVariables(localVariables: { [key: string]: string } = {}, endpoint: Endpoint, environment: Environment) : VariableManager {
        const merged :  { [key: string]: string } = {};

        for (const key in environment.variableScope.variableStore) {
            if (Object.prototype.hasOwnProperty.call(environment.variableScope.variableStore, key)) {
                const variable = environment.variableScope.variableStore[key];
                
                merged[key] = variable.value;
            }
        }

        // Endpoint overwrites environment
        for (const key in endpoint.variableScope.variableStore) {
            if (Object.prototype.hasOwnProperty.call(endpoint.variableScope.variableStore, key)) {
                const variable = endpoint.variableScope.variableStore[key];
                
                merged[key] = variable.value;
            }
        }

        // Local overwrites endpoint
        for (const key in localVariables) {
            if (Object.prototype.hasOwnProperty.call(localVariables, key)) {
                const value = localVariables[key];
                
                merged[key] = value;
            }
        }

        return new VariableManager(merged);
    }

    /**
     * Merges headers together:
     * - endpoint headers overwrite
     * - environment headers
     * 
     * @param endpoint 
     * @param environment 
     * @returns 
     */
    static mergeHeaders(endpoint: Endpoint, environment: Environment) : {[key: string]: Variable} {
        const merged :  { [key: string]: Variable } = {};

        for (const key in environment.headers) {
            if (Object.prototype.hasOwnProperty.call(environment.headers, key)) {
                const variable = environment.headers[key];
                
                merged[key] = variable;
            }
        }

        // Endpoint overwrites environment
        for (const key in endpoint.headers) {
            if (Object.prototype.hasOwnProperty.call(endpoint.headers, key)) {
                const variable = endpoint.headers[key];
                
                merged[key] = variable;
            }
        }

        return merged;
    }

}