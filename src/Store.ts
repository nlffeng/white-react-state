/**
 * Store 类
 */

import { validateSameName } from './util'

import { Model, StoreItem } from './types'

class Store {
  [propName: string]: any

  public add<T>(key: string, model: Model<T>): void {
    if (key in this) {
      console.error(`Store: 存在相同的 key:${key}，请重新设置 key`)
      return
    }

    const state = model.state
    const reducers = { ...(model.reducers || {}) }
    const effects = { ...(model.effects || {}) }

    const sameKeys = validateSameName(reducers, effects)
    if (sameKeys) {
      const str = sameKeys.join('、')
      console.warn(
        `Store：${key} 内部 reducers 和 effects 存在同名的 kye：${str}，将以 reducers 中的 key 有效`
      )

      sameKeys.forEach((k: string) => {
        if (effects[k]) {
          delete effects[k]
        }
      })
    }

    this[key] = {
      state,
      reducers,
      effects,
      subscribes: []
    }

    // 处理 reducers 和 effects
    this._relateMethods(key)

    this[key].dispatchers = {
      ...this[key].reducers,
      ...this[key].effects
    }
  }

  private _relateMethods(key: string): void {
    const stateObj: StoreItem = this[key]
    const subscribes = stateObj.subscribes

    const reducers = stateObj.reducers
    stateObj.reducers = {}

    const effects = stateObj.effects
    stateObj.effects = {}

    // 处理 reducers，绑定函数上下文
    Object.keys(reducers).forEach((reducerKey: string) => {
      const fn: any = reducers[reducerKey]

      if (typeof fn !== 'function') {
        console.error(`Store：${key} 中 reducers 对应的 ${reducerKey} 应该是函数`)
        return
      }

      stateObj.reducers[reducerKey] = (...arg) => {
        const newState = fn(stateObj.state, ...arg)
        this.setState(key, newState)

        subscribes.forEach((callback: () => void) => {
          callback()
        })
      }
    })

    // 处理 effects，绑定上下文，并处理一步
    const methods = {
      getState: this.getState.bind(this),
      getDispatchers: this.getDispatchers.bind(this)
    }
    Object.keys(effects).forEach((effectKey: string) => {
      const fn: any = effects[effectKey]

      if (typeof fn !== 'function') {
        console.error(`Store：${key} 中 effects 对应的 ${effectKey} 应该是函数`)
        return
      }

      stateObj.effects[effectKey] = async (...arg) => {
        await fn.call(stateObj.dispatchers, methods, ...arg)
      }
    })
  }

  public subscribe(key: string, callback: () => void): () => void {
    const stateObj: StoreItem = this[key]
    stateObj.subscribes.push(callback)
    const i = stateObj.subscribes.length - 1
    return () => {
      stateObj.subscribes.splice(i, 1)
    }
  }

  public getState(key: string): any {
    const stateObj: StoreItem = this[key]

    if (!stateObj) {
      return
    }

    return stateObj.state
  }

  public setState(key: string, state: any): void {
    const stateObj: StoreItem = this[key]

    if (!stateObj) {
      return
    }

    stateObj.state = state
  }

  public getDispatchers(key: string): { [propName: string]: (...arg: any[]) => any } {
    const stateObj: StoreItem = this[key]

    if (!stateObj) {
      return {}
    }

    return stateObj.dispatchers
  }
}

export default Store
