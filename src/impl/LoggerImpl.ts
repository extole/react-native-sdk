import type { Logger } from '../Logger';
import type { ExtoleNative } from './ExtoleNative';

export class LoggerImpl implements Logger {

  private extole: ExtoleNative;

  constructor(extoleNative: ExtoleNative) {
    this.extole = extoleNative;
  }

  debug(message: string): void {
    this.extole.debug(message)
  }

  info(message: string): void {
    this.extole.info(message)
  }

  warn(message: string): void {
    this.extole.warn(message)
  }


  error(message: string): void {
    this.extole.error(message)
  }

}
