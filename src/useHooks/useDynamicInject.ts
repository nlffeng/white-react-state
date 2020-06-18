/**
 * useDynamicInject(hook-动态注入)
 */

import useFirstMountState from './useFirstMountState'
import hasModel from '../hasModel'
import registerModel from '../registerModel'

import { Model } from '../types'

export default function useDynamicInject(model: Model): void {
  const isFirst = useFirstMountState()
  const namespace = model.namespace

  if (!namespace) {
    console.error('dynamicInjectFnComponent: 请检查是否声明了 namespace')
    return
  }

  if (isFirst && !hasModel(namespace)) {
    registerModel(model)
  }
}
