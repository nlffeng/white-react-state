/**
 * useModel(hook-状态与组件绑定)
 */

import { useEffect, useRef } from 'react'
import useUpdate from './useUpdate'
import store from '../storeInstance'

// TODO 加入优化功能, 第二个参数可以浅比较指定 state 判断是否触发组件更新
export default function useModel(namespace: string) {
  if (!namespace) {
    console.error(`useModel: 缺少参数 namespace`)
    return []
  }

  if (!(namespace in store)) {
    console.error(`useModel: 不存在 namespace: ${namespace}, 请检查传入的 ${namespace} 是否正确`)
    return []
  }

  const update = useUpdate()

  const unSubscribeRef = useRef<() => void>()
  if (!unSubscribeRef.current) {
    unSubscribeRef.current = store.subscribe(namespace, update)
  }

  const state = store.getState(namespace)
  const dispatchers = store.getDispatchers(namespace)

  // 卸载时去除订阅
  useEffect(
    () => () => {
      if (unSubscribeRef.current) {
        unSubscribeRef.current()
      }
    },
    []
  )

  return [state, dispatchers]
}
