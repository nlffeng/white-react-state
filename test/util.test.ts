import { validateSameName } from '../src/util'

describe('validateSameName', () => {
  test('测试返回值是正确的', () => {
    const objA = { a: 1, b: 2}
    const objB = { c: 3, b: 2, a: 3}
    const objC = { d: 'dd', e: 'ee' }

    expect(validateSameName(objA, objB)).toEqual(['a', 'b'])
    expect(validateSameName(objA, objC)).toBeNull()
  })
})
