/**
 * dynamicInject(动态注入 model)
 */

import React, { ComponentType } from 'react';
import useDynamicInject from './useHooks/useDynamicInject';

import { Model } from './types';

// TODO 未完善类型定义
type InjectedComponent = ComponentType;

type ComponentEnhancerWithProps = (Component: ComponentType<any>) => InjectedComponent;

type DynamicInject = (model: Model) => ComponentEnhancerWithProps;

const dynamicInject: DynamicInject = (model) => (Component) => (props) => {
  const namespace = model.namespace;

  if (!namespace) {
    console.error('dynamicInject：请检查是否声明了 namespace');
    return <Component {...props} />;
  }

  useDynamicInject(model);

  return <Component {...props} />;
}

export default dynamicInject;
