import type { Action, AppEvent } from 'extole-mobile-sdk';
import type { Extole } from 'extole-mobile-sdk';

export class PromptAction implements Action {
  type = 'PROMPT';
  title = 'PROMPT';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  execute(_event: AppEvent, _extole: Extole) {
    console.trace('Prompt Action was executed', this);
  }
}
