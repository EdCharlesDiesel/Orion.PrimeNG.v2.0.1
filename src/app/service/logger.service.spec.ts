import { TestBed } from '@angular/core/testing';
import { LoggerService, LogLevel } from './logger.service';

describe('LoggerService', () => {
  let service: LoggerService;
  let consoleDebugSpy: jasmine.Spy;
  let consoleInfoSpy: jasmine.Spy;
  let consoleWarnSpy: jasmine.Spy;
  let consoleErrorSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggerService);
    consoleDebugSpy = spyOn(console, 'debug');
    consoleInfoSpy = spyOn(console, 'info');
    consoleWarnSpy = spyOn(console, 'warn');
    consoleErrorSpy = spyOn(console, 'error');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('log levels', () => {
    it('should log debug messages when level is Debug', () => {
      service.setLogLevel(LogLevel.Debug);
      service.debug('Test debug message');
      expect(consoleDebugSpy).toHaveBeenCalled();
    });

    it('should not log debug messages when level is Info', () => {
      service.setLogLevel(LogLevel.Info);
      service.debug('Test debug message');
      expect(consoleDebugSpy).not.toHaveBeenCalled();
    });

    it('should log info messages when level is Info', () => {
      service.setLogLevel(LogLevel.Info);
      service.info('Test info message');
      expect(consoleInfoSpy).toHaveBeenCalled();
    });

    it('should log error messages when level is Error', () => {
      service.setLogLevel(LogLevel.Error);
      service.error('Test error message');
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should not log any messages when level is Off', () => {
      service.setLogLevel(LogLevel.Off);
      service.debug('Test debug message');
      service.info('Test info message');
      service.warn('Test warn message');
      service.error('Test error message');

      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });

  describe('error with trace', () => {
    it('should log error with stack trace', () => {
      const error = new Error('Test error');
      service.errorWithTrace('Operation failed', error);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('performance timing', () => {
    it('should start and end timer', () => {
      const timeSpy = spyOn(console, 'time');
      const timeEndSpy = spyOn(console, 'timeEnd');

      service.setLogLevel(LogLevel.Debug);
      service.time('test-timer');
      service.timeEnd('test-timer');

      expect(timeSpy).toHaveBeenCalledWith('test-timer');
      expect(timeEndSpy).toHaveBeenCalledWith('test-timer');
    });
  });
});
