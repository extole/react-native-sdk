import { ExtoleInternalImpl } from './ExtoleInternalImpl';
import { ViewFullScreenAction } from './ViewFullScreenAction';
import { PromptAction } from './PromptAction';
import { EventCondition } from './EventCondition';

export class ExtoleImpl extends ExtoleInternalImpl {

  constructor(
    programDomain: string,
    appName = 'react-native',
    sandbox = 'production-production',
    labels: [] = [],
    data: Record<string, string> = {},
    appData: Record<string, string> = {},
    appHeaders: Record<string, string> = {}) {
    super(programDomain, appName, sandbox, labels, data, appData, appHeaders);
  }

  protected registerDefaultActions() {
    this.customActions.VIEW_FULLSCREEN = ViewFullScreenAction.prototype;
    this.customActions.PROMPT = PromptAction.prototype;
    this.customConditions.EVENT = EventCondition.prototype;
  }
}
