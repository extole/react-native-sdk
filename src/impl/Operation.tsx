import type { Action } from './Action';
import type { Condition } from './Condition';

export class Operation {
  actions: Action[] = [];
  conditions: Condition[] = [];
}
