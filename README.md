# white-react-state

基于 useState 实现的轻量状态管理

### Install

```bash
npm i -S white-react-state
```

### Usage

注册 model，在函数组件中通过 useModel 拿到 state 和 reducers、effects 方法

```javascript
import { registerModel, useModel } from 'white-react-state';

registerModel({
  namespace: 'testModel',
  state: {
    count: 0,
  },
  reducers: {
    increment: (state) => ({
      ...state,
      count: state.count + 1,
    }),
    decrement: (state) => ({
      ...state,
      count: state.count - 1,
    }),
    set: (state, v) => ({
      ...state,
      count: v,
    })
  },
  effects: {
    async asyncDecrement({ getState, getDispatchers }, ...arg) {
      const state = getState('testModel');
      console.log(...arg);

      const res = await (new Promise(resolve => {
        setTimeout(() => {
          resolve(111);
        }, 500);
      }));

      this.set(res);
    }
  },
});

function Test(props) {
  const [state, dispatchers] = useModel('testModel');
  const { increment, decrement, asyncDecrement } = dispatchers;
  const { count } = state;

  return (
    <div>
      <span>{count}</span>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={() => asyncDecrement(1, 3, 5)}>异步处理</button>
    </div>
  );
}
```
