import { renderHook } from '@testing-library/react-hooks'
import useFirstMountState from '../../src/useHooks/useFirstMountState'

describe('useFirstMountState', () => {
  test('测试返回值是正确的', () => {
    const { result, rerender } = renderHook(() => useFirstMountState())

    expect(result.current).toBeTruthy()

    rerender()
    expect(!result.current).toBeTruthy()

    rerender()
    expect(!result.current).toBeTruthy()
  })
})
