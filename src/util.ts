type ValidateSameNameFn = (objA: { [propName: string]: any }, objB: { [propName: string]: any }) => string[] | null

export const validateSameName: ValidateSameNameFn = (objA = {}, objB = {}) => {
  const ret = [];

  for (const k in objA) {
    if (k in objB) {
      ret.push(k);
    }
  }

  return (ret.length ? ret : null);
}
