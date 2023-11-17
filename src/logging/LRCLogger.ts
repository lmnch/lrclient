import chalk from "chalk";
import Endpoint from "../model/Endpoint";
import Environment from "../model/Environment";
import LRCRequest from "../model/LRCRequest";
import LRCResponse from "../model/LRCResponse";
import Payload from "../payload/Payload";
import LRCLoggerConfig from "./LRCLoggerConfig";

const log = console.log;
export default class LRCLogger {
  static instance = new LRCLogger();

  loggerConfig: LRCLoggerConfig;

  constructor(config: LRCLoggerConfig = new LRCLoggerConfig({})) {
      this.loggerConfig = config;
  }

  logEnvironment(environmentKey: string, e: Environment) {
      if (this.loggerConfig.logEnvironments) {
          log(chalk.bold.underline(environmentKey));
          log(chalk.bold("Headers:"));
          Object.entries(e.headers).forEach(([key, variable]) => {
              log(chalk.green(`${key}: ${variable.value}`));
          });

          log(chalk.bold("Variables:"));
          Object.entries(e.variableScope.variableStore).forEach(
              ([key, variable]) => {
                  log(chalk.green(`${key}=${variable.value}`));
              },
          );

          this.nl();
      }
  }

  async logEndpoint(endpointPath: string, e: Endpoint) {
      if (this.loggerConfig.logEndpoint) {
          log(chalk.bold.underline.black(endpointPath));
          let normalizedMethod = e.method.toString();
          while (normalizedMethod.length < 4) {
              normalizedMethod = " " + normalizedMethod;
          }
          log(chalk.bgMagenta.black(normalizedMethod), chalk.blue(e.url.value));

          Object.entries(e.headers).forEach(([key, variable]) => {
              log(chalk.cyan(`${key}: ${variable.value}`));
          });
      }
      if (this.loggerConfig.logEndpointPayload && e.payload) {
          log(chalk.blue(await e.payload.getRawData(true)));
      }
      if (
          this.loggerConfig.logEndpoint ||
      (this.loggerConfig.logEndpointPayload && e.payload)
      ) {
          this.nl();
      }
  }

  logRequest(req: LRCRequest) {
      if (this.loggerConfig.logRequest) {
          log(chalk.bold.underline.black("Request:"));
          let normalizedMethod = req.method.toString();
          while (normalizedMethod.length < 4) {
              normalizedMethod = " " + normalizedMethod;
          }
          log(chalk.bgMagenta.black(normalizedMethod), chalk.blue(req.url));
          Object.entries(req.headers).forEach(([key, header]) => {
              log(chalk.cyan(`${key}: ${header}`));
          });
      }
      if (this.loggerConfig.logRequestBody && req.body) {
          log(chalk.blue(req.body));
      }

      if (
          this.loggerConfig.logRequest ||
      (this.loggerConfig.logRequestBody && req.body)
      ) {
          this.nl();
      }
  }

  async logResponse(response: LRCResponse) {
      if (this.loggerConfig.logResponse) {
          log(chalk.bold.underline.white("Response:"));

          const bg =
        response.status < 300
            ? chalk.green
            : response.status > 400 && response.status < 500
                ? chalk.red
                : response.status >= 500
                    ? chalk.magenta
                    : chalk.white;
          log(bg.black(response.status), chalk.white(response.statusText));

          Object.entries(response.headers).forEach(([key, header]) => {
              log(chalk.yellow(`${key}: ${header}`));
          });
      }

      let loggedPayload = false;
      if (this.loggerConfig.logResponseBody) {
      // Try extracting payload
          try {
              const payload = await response.extractPayload();
              if (payload) {
                  log(chalk.white(await payload?.getRawData(true)));
                  loggedPayload = true;
              }
          } catch (e: any) {
              this.logError(e.message, e);
          }
      }

      if (
          this.loggerConfig.logResponse ||
      (this.loggerConfig.logResponseBody && loggedPayload)
      ) {
          this.nl();
      }
  }

  async logPayload(payload: Payload) {
      log(chalk.cyan("Type: "), chalk.white(payload.getContentTypeHeader()));
      log(chalk.white(await payload.getRawData(true)));
  }

  logError(message: string | undefined, e: Error) {
      log(chalk.bgRed.black(message));
      log(chalk.red(e.message));
      log(chalk.red(e.stack));
      this.nl();
  }

  nl() {
      log();
  }
}
