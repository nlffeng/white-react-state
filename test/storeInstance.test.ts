import Store from '../src/Store'
import storeInstance from '../src/storeInstance'
import { model } from './config'
import { mockConsoleError } from './mockConsole'

describe('Store', () => {
  mockConsoleError()

  const newModel: any = {
    ...model,
    subscribes: [],
  }
  delete newModel.namespace

  test('是否为Store实例', () => {
    expect(storeInstance).toBeInstanceOf(Store)
  })

  test('add 方法正确添加 model', () => {
    storeInstance.add('testModel', newModel)

    // 有 model 数据
    expect(storeInstance['testModel']).toEqual({ ...newModel, dispatchers: {} })

    // 添加相同命名 model，错误提示
    const model2 = { ...newModel, state: {} }
    storeInstance.add('testModel', model2)
    expect(global.console.error).toHaveBeenCalledWith(
      'Store: 存在相同的 namespace: testModel, 请重新设置 namespace'
    );
    expect(storeInstance['testModel']).toEqual({ ...newModel, dispatchers: {} })
    expect(storeInstance['testModel'].state).toBe(newModel.state)
    expect(storeInstance['testModel'].state).not.toBe(model2.state)
  })

  test('add 方法消除 reducers 和 effects 同名属性', () => {
    newModel.reducers.add = () => { }
    newModel.effects.add = async () => { }

    storeInstance.add('testModel2', newModel)
    const storeItem = storeInstance['testModel2']

    expect(global.console.warn).toHaveBeenCalledWith(
      'Store: testModel2 内部 reducers 和 effects 存在同名的 namespace: add, 将以 reducers 中的 namespace 有效'
    );
    expect(storeItem.dispatchers.add).toBe(storeItem.reducers.add)
    expect(storeItem.effects.add).toBeUndefined()
  });
})
