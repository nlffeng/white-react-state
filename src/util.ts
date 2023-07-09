type ValidateSameNameFn = <T extends object, U extends object>(objA: T, objB: U) => Array<Extract<keyof T, keyof U>> | null

export const validateSameName: ValidateSameNameFn = (objA, objB) => {
  const ret = [];

  for (const k in objA) {
    if (objA.hasOwnProperty(k) && objB.hasOwnProperty(k)) {
      ret.push(k as any);
    }
  }

  return (ret.length ? ret : null);
}
