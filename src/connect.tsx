/**
 * connect(高阶组件-关联状态)
 */

import React, { ComponentType } from 'react';
import useModel from './useHooks/useModel';

// TODO 未完善类型定义
type ConnectedComponent = ComponentType;

type ComponentEnhancerWithProps = (Component: ComponentType<any>) => ConnectedComponent;

type Connect = (key: string | string[]) => ComponentEnhancerWithProps;

interface ModelList {
  [propName: string]: {
    state: any
    dispatchers: any
  }
}

// TODO 加入优化功能
const connect: Connect = (key) => {
  let keys: string[] = [];

  if (typeof key === 'string') {
    keys.push(key);
  } else if (Array.isArray(key)) {
    keys = key;
  }

  const length = keys.length;

  const componentEnhancer: ComponentEnhancerWithProps = (Component) => (props) => {
    const modelList: ModelList = {};
    let i = 0;

    while (i < length) {
      const k = keys[i];
      const [state, dispatchers] = useModel(k);
      modelList[k] = {
        state,
        dispatchers,
      };
      i++;
    }

    return (<Component {...props} {...modelList} />);
  };

  return componentEnhancer;
};

export default connect;
