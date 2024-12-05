import pc from "picocolors";

type LogLevel = "info" | "success" | "warning" | "error" | "debug";

class Logger {
  private debugMode = false;

  setDebugMode(enabled: boolean) {
    this.debugMode = enabled;
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    ...args: any[]
  ): string {
    const timestamp = new Date().toISOString();
    const formattedMessage = args.length
      ? this.format(message, ...args)
      : message;

    return `${pc.gray(timestamp)} ${this.getLevelPrefix(
      level
    )} ${formattedMessage}`;
  }

  private getLevelPrefix(level: LogLevel): string {
    switch (level) {
      case "info":
        return pc.blue("ℹ");
      case "success":
        return pc.green("✔");
      case "warning":
        return pc.yellow("⚠");
      case "error":
        return pc.red("✖");
      case "debug":
        return pc.magenta("🔍");
      default:
        return "";
    }
  }

  private format(message: string, ...args: any[]): string {
    return message.replace(/%([a-zA-Z%])/g, (match, format) => {
      if (match === "%%") return "%";
      if (args.length === 0) return match;
      return String(args.shift());
    });
  }

  info(message: string, ...args: any[]) {
    console.log(this.formatMessage("info", message, ...args));
  }

  success(message: string, ...args: any[]) {
    console.log(this.formatMessage("success", message, ...args));
  }

  warning(message: string, ...args: any[]) {
    console.warn(this.formatMessage("warning", message, ...args));
  }

  error(message: string | Error, ...args: any[]) {
    if (message instanceof Error) {
      console.error(this.formatMessage("error", message.message));
      if (this.debugMode && message.stack) {
        console.error(pc.gray(message.stack));
      }
    } else {
      console.error(this.formatMessage("error", message, ...args));
    }
  }

  debug(message: string, ...args: any[]) {
    if (this.debugMode) {
      console.debug(this.formatMessage("debug", message, ...args));
    }
  }

  // Progress indicator
  progress(message: string) {
    process.stdout.write(this.formatMessage("info", message));
  }

  // Clear line and move cursor to start
  clearLine() {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
  }

  // Create a spinner
  spinner(message: string) {
    const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
    let i = 0;

    const spin = () => {
      const frame = frames[(i = ++i % frames.length)];
      this.clearLine();
      this.progress(`${pc.cyan(frame)} ${message}`);
    };

    const interval = setInterval(spin, 80);
    spin();

    return {
      stop: (endMessage?: string) => {
        clearInterval(interval);
        this.clearLine();
        if (endMessage) {
          this.success(endMessage);
        }
      },
    };
  }
}

export const logger = new Logger();
