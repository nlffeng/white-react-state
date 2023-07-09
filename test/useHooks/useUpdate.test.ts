import { renderHook, act } from '@testing-library/react-hooks'
import useUpdate from '../../src/useHooks/useUpdate'

describe('useUpdate', () => {
  test('正确更新组件', async () => {
    let renderNum = 0

    const { result } = renderHook(() => {
      renderNum += 1
      return useUpdate()
    })

    const update = result.current

    expect(renderNum).toBe(1)

    act(() => {
      update()
    })

    expect(renderNum).toBe(2)

    expect(result.current).toBe(update)
  })
})
