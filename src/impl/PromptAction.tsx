import type { Action } from '../Action';
import type { AppEvent } from './AppEvent';
import type { ExtoleInternal } from './ExtoleInternal';

export class PromptAction implements Action {
  type = 'PROMPT';
  title = 'PROMPT';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  execute(_event: AppEvent, _extole: ExtoleInternal) {
    console.trace('Prompt Action was executed', this);
  }
}
