import type { Condition } from '../Condition';
import type { AppEvent } from './AppEvent';
import type { ExtoleInternal } from './ExtoleInternal';

export class EventCondition implements Condition {
  type = 'EVENT';
  title = 'EVENT';

  has_data_keys: string[] = [];
  has_data_vales: string[] = [];
  event_names: string[] = [];

  test(event: AppEvent, _: ExtoleInternal): boolean {
    console.trace('Event Condition was executed', event);
    return this.event_names.includes(event.name);
  }
}
