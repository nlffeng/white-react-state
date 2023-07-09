import { renderHook } from '@testing-library/react-hooks'
import useModel from '../../src/useHooks/useModel'
import store from '../../src/storeInstance'
import { mockConsoleError } from '../mockConsole'

jest.mock('../../src/storeInstance')

describe('useModel', () => {
  mockConsoleError()

  test('打印 error', () => {
    renderHook(() => useModel(undefined as any))
    expect(global.console.error).toHaveBeenCalledWith(
      'useModel: 缺少参数 namespace'
    );

    // store['testModel'] = {}
    renderHook(() => useModel('testModel'))
    expect(global.console.error).toHaveBeenCalledWith(
      'useModel: 不存在 namespace: testModel, 请检查传入的 testModel 是否正确'
    )

    expect(store.subscribe).not.toHaveBeenCalled();
  })

  test('返回正确的数据并卸载时正确调用', () => {
    store['testModel'] = {}
    const unSubscribe = jest.fn()
    store.subscribe  = jest.fn(() => unSubscribe)
    store.getState = jest.fn(() => 'getState')
    store.getDispatchers = jest.fn(() => ({}))

    const { result, rerender, unmount } = renderHook(() => useModel('testModel'))
    const [state, dispatchers] = result.current

    expect(state).toBe('getState')
    expect(dispatchers).toEqual({})

    rerender()

    expect(state).toBe('getState')
    expect(dispatchers).toEqual({})

    unmount()

    expect(unSubscribe).toHaveBeenCalled()
    expect(unSubscribe).toHaveBeenCalledTimes(1)
  })
})
