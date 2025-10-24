import { ExtoleInternalImpl } from './ExtoleInternalImpl';
import { ViewFullScreenAction } from './ViewFullScreenAction';
import { PromptAction } from './PromptAction';
import { EventCondition } from './EventCondition';

export class ExtoleImpl extends ExtoleInternalImpl {

  constructor(
    programDomain: string) {
    super(programDomain);
    this.registerDefaultActions()
  }

  protected registerDefaultActions() {
    this.customActions.VIEW_FULLSCREEN = ViewFullScreenAction.prototype;
    this.customActions.PROMPT = PromptAction.prototype;
    this.customConditions.EVENT = EventCondition.prototype;
  }
}
