import type { AppEvent, Condition, Extole } from 'extole-mobile-sdk';

export class EventCondition implements Condition {
  type = 'EVENT';
  title = 'EVENT';

  has_data_keys: string[] = [];
  has_data_vales: string[] = [];
  event_names: string[] = [];

  test(event: AppEvent, _: Extole): boolean {
    console.trace('Event Condition was executed', event);
    return this.event_names.includes(event.name);
  }
}
