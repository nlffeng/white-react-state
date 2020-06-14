/**
 * useModel(hook-状态与组件绑定)
 */

import { useEffect, useRef } from 'react';
import useUpdate from './useUpdate';
import store from './storeInstance';

export default function useModel(key: string) {
  if (!key) {
    console.error(`useModel：缺少参数 key`);
    return [];
  }

  if (!(key in store)) {
    console.error(`useModel：不存在 key：${key}，请检查传入的 ${key} 是否正确`);
    return [];
  }

  const update = useUpdate();

  const unSubscribeRef = useRef<() => void>();
  if (!unSubscribeRef.current) {
    unSubscribeRef.current = store.subscribe(key, update);
  }

  const state = store.getState(key);
  const dispatchers = store.getDispatchers(key);

  // 卸载时去除订阅
  useEffect(() => () => {
    if (unSubscribeRef.current) {
      unSubscribeRef.current();
    }
  }, []);

  return [state, dispatchers];
}
