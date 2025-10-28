import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';

export enum LogLevel {
  Debug = 0,
  Info = 1,
  Warn = 2,
  Error = 3,
  Off = 4
}

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private logLevel: LogLevel = LogLevel.Debug;
  private readonly logWithDate: boolean = true;

  constructor() {
    if (environment.production) {
      this.logLevel = LogLevel.Warn;
    }
  }

  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  getLogLevel(): LogLevel {
    return this.logLevel;
  }

  debug(message: string, ...optionalParams: any[]): void {
    this.log(LogLevel.Debug, 'DEBUG', message, optionalParams);
  }

  info(message: string, ...optionalParams: any[]): void {
    this.log(LogLevel.Info, 'INFO', message, optionalParams);
  }


  warn(message: string, ...optionalParams: any[]): void {
    this.log(LogLevel.Warn, 'WARN', message, optionalParams);
  }

  error(message: string, ...optionalParams: any[]): void {
    this.log(LogLevel.Error, 'ERROR', message, optionalParams);
  }

  errorWithTrace(message: string, error: Error, ...optionalParams: any[]): void {
    const params = [error.stack, ...optionalParams];
    this.log(LogLevel.Error, 'ERROR', `${message}: ${error.message}`, params);
  }

  private log(level: LogLevel, levelString: string, message: string, optionalParams: any[]): void {
    if (this.shouldLog(level)) {
      const timestamp = this.logWithDate ? new Date().toISOString() : '';
      const formattedMessage = this.formatMessage(timestamp, levelString, message);

      switch (level) {
        case LogLevel.Debug:
          console.debug(formattedMessage, ...optionalParams);
          break;
        case LogLevel.Info:
          console.info(formattedMessage, ...optionalParams);
          break;
        case LogLevel.Warn:
          console.warn(formattedMessage, ...optionalParams);
          break;
        case LogLevel.Error:
          console.error(formattedMessage, ...optionalParams);
          break;
        default:
          console.log(formattedMessage, ...optionalParams);
      }
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel && this.logLevel !== LogLevel.Off;
  }

  private formatMessage(timestamp: string, levelString: string, message: string): string {
    if (this.logWithDate) {
      return `[${timestamp}] [${levelString}] ${message}`;
    }
    return `[${levelString}] ${message}`;
  }

  time(label: string): void {
    if (this.shouldLog(LogLevel.Debug)) {
      console.time(label);
    }
  }

  timeEnd(label: string): void {
    if (this.shouldLog(LogLevel.Debug)) {
      console.timeEnd(label);
    }
  }

  group(label: string): void {
    if (this.shouldLog(LogLevel.Debug)) {
      console.group(label);
    }
  }
  groupEnd(): void {
    if (this.shouldLog(LogLevel.Debug)) {
      console.groupEnd();
    }
  }
}
