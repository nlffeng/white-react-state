/**
 * destroyModel(销毁 model)
 */

import store from './storeInstance';

import { StoreItem } from './types';

export default function destroyModel(key: string) {
  const stateObj: StoreItem = store[key];

  if (!stateObj) {
    return;
  }

  const subscribes = stateObj.subscribes;

  if (subscribes.length) {
    console.warn(`destroyModel：${key} 存在活跃组件正在使用 useModel，无法销毁 model`);
    return;
  }

  delete store[key];
}
