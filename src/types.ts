export interface Model<T = any> {
  namespace?: string
  state: T
  reducers: {
    [propName: string]: (prevState: T) => T
  }
  effects: {
    // TODO
    [propName: string]: (...arg: any[]) => Promise<void>
  }
}

export interface StoreItem<T = any> {
  state: T
  reducers: {
    [propName: string]: (prevState: T) => T
  }
  effects: {
    // TODO
    [propName: string]: (...arg: any[]) => Promise<void>
  }
  subscribes: Array<() => void>
  dispatchers: {
    [propName: string]: (...arg: any[]) => any
  }
}
