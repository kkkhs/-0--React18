import { REACT_ELEMENT_TYPE } from '@/shared/ReactSymbols'
import {
  Type,
  Key,
  Ref,
  Props,
  ElementType,
  ReactElementType,
} from '@/shared/ReactTypes'

// ReactElement 构造函数实现
const ReactElement = function (
  type: Type,
  key: Key,
  ref: Ref,
  props: Props
): ReactElementType {
  const element = {
    $$typeof: REACT_ELEMENT_TYPE, // 内部字段, 指明当前字段是reactElement
    type,
    key,
    ref,
    props,
    __mark: 'khs', // 该字段是为了与真实的react项目区分开
  }

  return element
}

// jsx 函数实现
export const jsx = (type: ElementType, config: any, ...maybeChildren: any) => {
  let key: Key = null
  let ref: Ref = null
  const props: Props = {}

  // 遍历config
  for (const prop in config) {
    const val = config[prop]
    // 1. 单独找出 key和ref字段
    if (prop === 'key') {
      if (val !== undefined) {
        key = '' + val
      }
      continue
    }
    if (prop === 'ref') {
      if (val !== undefined) {
        ref = val
      }
      continue
    }
    // 2. 剩下的如果是config自身的prop, 则正常取出
    if ({}.hasOwnProperty.call(config, prop)) {
      props[prop] = val
    }
  }

  const maybeChildrenLength = maybeChildren.length
  if (maybeChildrenLength) {
    // [child] 或 [child, child, child]
    if (maybeChildrenLength === 1) {
      props.child = maybeChildren[0]
    } else {
      props.child = maybeChildren
    }
  }
  return ReactElement(type, key, ref, props)
}

// jsxDEV 函数实现
export const jsxDEV = (type: ElementType, config: any) => {
  let key: Key = null
  let ref: Ref = null
  const props: Props = {}

  // 遍历config
  for (const prop in config) {
    const val = config[prop]
    // 1. 单独找出 key和ref字段
    if (prop === 'key') {
      if (val !== undefined) {
        key = '' + val
      }
      continue
    }
    if (prop === 'ref') {
      if (val !== undefined) {
        ref = val
      }
      continue
    }
    // 2. 剩下的如果是config自身的prop, 则正常取出
    if ({}.hasOwnProperty.call(config, prop)) {
      props[prop] = val
    }
  }

  return ReactElement(type, key, ref, props)
}
