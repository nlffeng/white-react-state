/**
 * registerModel(注册 model)
 */

import store from './storeInstance';

import { Model } from './types';

export default function registerModel(model: Model) {
  const namespace = model.namespace;

  if (!namespace) {
    console.error(`registerModel：请检查是否声明了 namespace`);
    return;
  }

  if (namespace in store) {
    console.error(`registerModel：存在胸痛的 namespace：${namespace}，请重新设置 namespace`);
    return;
  }

  store.add(namespace, {
    state: model.state,
    reducers: model.reducers,
    effects: model.effects,
  });
}
