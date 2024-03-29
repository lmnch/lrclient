import * as fs from "fs/promises";
import Environment from "../model/Environment";
import Variable from "../variables/Variable";
import VariableManager from "../variables/VariableManager";
import { AuthConfig } from "./AuthLoader";
import Auth from "../auth/Auth";

/**
 * Basic env config that can be parsed from json string
 */
class EnvironmentConfig {
    headers: { [name: string]: string } = {};
    variables: { [key: string]: string } = {};
    auth: AuthConfig | undefined;

    static _mapHeaders(headers: { [name: string]: string }): {
        [key: string]: Variable;
    } {
        const mapped: { [key: string]: Variable } = {};
        for (const key in headers) {
            if (Object.prototype.hasOwnProperty.call(headers, key)) {
                const value = headers[key];

                mapped[key] = new Variable(key, value);
            }
        }
        return mapped;
    }

    static toEnvironment(ec: EnvironmentConfig): Environment {
        let auth: Auth | undefined = undefined;
        if (ec.auth) {
            auth = AuthConfig.toAuth(ec.auth);
        }
        return new Environment(
            EnvironmentConfig._mapHeaders(ec.headers),
            new VariableManager(ec.variables),
            auth
        );
    }
}

/**
 * Loads an enviroment from disk.
 *
 * @param envPath path to the json file which should be parsed to an environment
 * @returns Parsed environment
 */
export async function loadEnvironment(envPath: string): Promise<Environment> {
    const data = await fs.readFile(envPath);
    return EnvironmentConfig.toEnvironment(
        <EnvironmentConfig>JSON.parse(data.toString())
    );
}
