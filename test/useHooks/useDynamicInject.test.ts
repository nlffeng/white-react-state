import { renderHook, act } from '@testing-library/react-hooks'
import useDynamicInject from '../../src/useHooks/useDynamicInject'
import registerModel from '../../src/registerModel'
import { model } from '../config'
import { mockConsoleError } from '../mockConsole'

jest.mock('../../src/registerModel')

describe('useDynamicInject', () => {
  mockConsoleError()

  test('打印 error', () => {
    renderHook(() => useDynamicInject({} as any))

    expect(global.console.error).toHaveBeenCalledWith(
      'dynamicInjectFnComponent: 请检查是否声明了 namespace'
    );

    expect(registerModel).not.toHaveBeenCalled();
  })

  test('加载时注入', () => {
    const { rerender } = renderHook(() => useDynamicInject(model))

    expect(registerModel).toHaveBeenCalled();
    expect(registerModel).toHaveBeenCalledTimes(1);

    rerender()

    expect(registerModel).toHaveBeenCalledTimes(1);
  })
})
