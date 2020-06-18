# white-react-state

基于 useState 实现的轻量状态管理

### Install

```bash
npm i -S white-react-state
```

### Usage

注册 model, 在函数组件中通过 useModel 拿到 state 和 reducers、effects 方法

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

### API

共有 7 个 API, 主要使用的2个: registerModel、useModel, 通常对于函数组件使用更为友好, 下面介绍这些 API: 

#### registerModel

作为状态管理, 首先应该是一些数据和方法的定义, 这个 api 将会注册这些数据和方法, 使用方式如下: 

> registerModel(modle)

其中 model 是数据和方法的定义模型对象, 有以下属性: 

- namespace
  - 必填, 命名空间, 和其他 model 不可重复
- state
  - 必填, 状态数据, 任意类型的数据
- reducers
  - 可选, 可定义的纯函数集合, 直接改变状态数据, 改变数据的同时触发相关联的组件更新
  - 纯函数的第一个参数是当前 state, 后面的参数是在调用时传入的
- effects
  - 可选, 可定义的副作用函数集合, 函数内可以做一些副作用的事情, 如请求数据等
  - 函数内部可以是用 this 访问到当前 model 下的 reducers 和 effects 中方法, 如: this.increment()
  - 函数的第一个参数是一个对象, 后面的参数为调用时传入的。第一个参数对象如下: 
    - getState 方法, 获取指定 命名空间 的 state, 参数为: 
      - namespace: string, 为指定 命名空间
      - 如: const state = getState('otherModel')
    - getDispatchers 方法, 获取指定 命名空间 的 方法(reducers 和 effects 的集合), 参数为: 
      - namespace: string, 为指定 命名空间
      - 如: const dispatchers = getDispathcers('otherModel')

注: 通常使用这个方法, 不能重复注册同一个 命名空间 的 model, 如果重复, 控制台会给出报错提示, 不会覆盖之前的 model; 如果你需要动态注入 model, 根据组件挂载注册 model, 可以使用 useDynamicInject 或 dynamicInject, 详细见下方介绍


#### useModel

在函数组件中获取指定的 model 数据, 它是一个 hook, 使用方式如下: 

> const [state, dispatchers] = useModel(namespace);

参数 namespace 为指定的 命名空间; 函数返回值是一个长度为 2 的数组, 其内容如下: 

- 下标 0 为 命名空间 下的 state 数据
- 下标 1 为 命名空间 下的 reducers 和 effects 方法集合


#### connect

一个高阶函数, 为组件获取指定的 model 数据; 实际上内部实现基于 useModel

> connect(namespace)(Component)

- namespace: string | string[], 字符串 或 字符串数组, 为指定的 命名空间
- Component, 为包裹组件, 其 props 将会接收到 namespace 对应的 model 数据, 包装在其 命名空间 下, 如下: 

```javascript
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'white-react-state';

function Test(props) {
  const { testModel } = props;
  const { state, dispatchers } = testModel;

  console.log(state, dispatchers);

  return (
    <div>
      xxxx
    </div>
  );
}

Test.propTypes = {
  testModel: PropTypes.object.isRequired,
};

Test.defaultProps = {};

export default connect(['testModel'])(React.memo(Test));
```


#### useDynamicInject

一个 hook, 动态注入 model, 在函数组件挂载时, 注册 model, 效果同 registerModel

> useDynamicInject(model)

model 同 registerModel 中参数一致, 如上

注:  函数组件卸载时不会销毁 model, 如果需要可以使用 destroyModel

示例: 

```javascript
import React from 'react';
import { useDynamicInject, useModel } from 'white-react-state';

const model = {
  namespace: 'testModel',
  state: 0,
  reducers: {},
  effects: {}
};

function Test() {
  // 动态注入, 在挂载时
  useDynamicInject(model);

  const [state, dispatchers] = useModel('testModel');

  console.log(state, dispatchers);

  return (
    <div>
      xxxx
    </div>
  );
}

Test.defaultProps = {};

export default React.memo(Test);
```


#### dynamicInject

一个高阶函数, 动态注入 model, 在组件挂载时, 注册 model, 效果同 registerModel; 实际上内部实现基于 useDynamicInject

> dynamicInject(model)(Component)

model 同 registerModel 中参数一致, 如上

注:  组件卸载时不会销毁 model, 如果需要可以使用 destroyModel

示例: 

```javascript
import React from 'react';
import { dynamicInject, useModel } from 'white-react-state';

const model = {
  namespace: 'testModel',
  state: 0,
  reducers: {},
  effects: {}
};

function Test() {
  const [state, dispatchers] = useModel('testModel');

  console.log(state, dispatchers);

  return (
    <div>
      xxxx
    </div>
  );
}

Test.defaultProps = {};

export default dynamicInject(model)(React.memo(Test));
```


#### hasModel

一个方法, 用于判断是否存在指定 命名空间 的 model, 返回值: boolean

> hasModel(namespace)

namespace: string,  为指定的 命名空间


#### destroyModel

一个方法, 销毁指定 命名空间 的 model; 一般来说是不需要使用这个 API 的, 当你真的需要调用时, 请先确保指定的 model 是否被正在活跃的组件引用, 即 connect 和 useModel 正被使用, 当然控制台会给出相应的报错提示, 并不会销毁 model

> destroyModel(namespace)
