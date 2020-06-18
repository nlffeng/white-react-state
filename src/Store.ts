/**
 * Store 类
 */

import { validateSameName } from './util'

import { Model, StoreItem } from './types'

class Store {
  [propName: string]: any

  public add<T>(namespace: string, model: Model<T>): void {
    if (namespace in this) {
      console.error(`Store: 存在相同的 namespace: ${namespace}, 请重新设置 namespace`)
      return
    }

    const state = model.state
    const reducers = { ...(model.reducers || {}) }
    const effects = { ...(model.effects || {}) }

    const sameKeys = validateSameName(reducers, effects)
    if (sameKeys) {
      const str = sameKeys.join('、')
      console.warn(
        `Store: ${namespace} 内部 reducers 和 effects 存在同名的 namespace: ${str}, 将以 reducers 中的 namespace 有效`
      )

      sameKeys.forEach((k: string) => {
        if (effects[k]) {
          delete effects[k]
        }
      })
    }

    this[namespace] = {
      state,
      reducers,
      effects,
      subscribes: []
    }

    // 处理 reducers 和 effects
    this._relateMethods(namespace)

    this[namespace].dispatchers = {
      ...this[namespace].reducers,
      ...this[namespace].effects
    }
  }

  private _relateMethods(namespace: string): void {
    const stateObj: StoreItem = this[namespace]
    const subscribes = stateObj.subscribes

    const reducers = stateObj.reducers
    stateObj.reducers = {}

    const effects = stateObj.effects
    stateObj.effects = {}

    // 处理 reducers, 绑定函数上下文
    Object.keys(reducers).forEach((reducerKey: string) => {
      const fn: any = reducers[reducerKey]

      if (typeof fn !== 'function') {
        console.error(`Store: ${namespace} 中 reducers 对应的 ${reducerKey} 应该是函数`)
        return
      }

      stateObj.reducers[reducerKey] = (...arg) => {
        const newState = fn(stateObj.state, ...arg)
        this.setState(namespace, newState)

        subscribes.forEach((callback: () => void) => {
          callback()
        })
      }
    })

    // 处理 effects, 绑定上下文, 并处理一步
    const methods = {
      getState: this.getState.bind(this),
      getDispatchers: this.getDispatchers.bind(this)
    }
    Object.keys(effects).forEach((effectKey: string) => {
      const fn: any = effects[effectKey]

      if (typeof fn !== 'function') {
        console.error(`Store: ${namespace} 中 effects 对应的 ${effectKey} 应该是函数`)
        return
      }

      stateObj.effects[effectKey] = async (...arg) => {
        await fn.call(stateObj.dispatchers, methods, ...arg)
      }
    })
  }

  public subscribe(namespace: string, callback: () => void): () => void {
    const stateObj: StoreItem = this[namespace]
    stateObj.subscribes.push(callback)
    const i = stateObj.subscribes.length - 1
    return () => {
      stateObj.subscribes.splice(i, 1)
    }
  }

  public getState(namespace: string): any {
    const stateObj: StoreItem = this[namespace]

    if (!stateObj) {
      return
    }

    return stateObj.state
  }

  public setState(namespace: string, state: any): void {
    const stateObj: StoreItem = this[namespace]

    if (!stateObj) {
      return
    }

    stateObj.state = state
  }

  public getDispatchers(namespace: string): { [propName: string]: (...arg: any[]) => any } {
    const stateObj: StoreItem = this[namespace]

    if (!stateObj) {
      return {}
    }

    return stateObj.dispatchers
  }
}

export default Store
