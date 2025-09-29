import { ILogger } from "../../../application/ports/ILogger";

export class LoggerConsole implements ILogger {
  info(msg: string): void {
    console.log("[INFO]", msg);
  }

  error(msg: string): void {
    console.error("[ERROR]", msg);
  }
}
