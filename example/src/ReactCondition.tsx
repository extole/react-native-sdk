import type { Condition, AppEvent } from 'extole-mobile-sdk';
import type { Extole } from 'extole-mobile-sdk';

export class CustomReactCondition implements Condition {
  type = 'CUSTOM';
  title = 'REACT_CONDITION';

  test(event: AppEvent, _: Extole): boolean {
    console.log('React Condition was executed', event);
    return true;
  }
}
