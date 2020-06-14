/**
 * hasModel(是否有指定 model)
 */

import store from './storeInstance';

import { StoreItem } from './types';

export default function hasModel(key: string) {
  const stateObj: StoreItem = store[key];

  if (!stateObj) {
    return false;
  }

  return true;
}
