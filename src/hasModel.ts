/**
 * hasModel(是否有指定 model)
 */

import store from './storeInstance'

import { StoreItem } from './types'

export default function hasModel(namespace: string) {
  const stateObj: StoreItem = store[namespace]

  if (!stateObj) {
    return false
  }

  return true
}
