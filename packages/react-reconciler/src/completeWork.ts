import {
  Container,
  appendInitialChild,
  createInstance,
  createTextInstance,
} from 'hostConfig'
import { FiberNode } from './fiber'
import {
  FunctionComponent,
  HostComponent,
  HostRoot,
  HostText,
} from './workTags'
import { NoFlags } from './fiberFlags'

/**
 * 递归中的归阶段
 * 生成更新计划，计算和收集更新 flags
 *  */
export const completeWork = (wip: FiberNode) => {
  const newProps = wip.pendingProps
  const current = wip.alternate
  switch (wip.tag) {
    case HostComponent:
      if (current !== null && wip.stateNode) {
        // update
      } else {
        // mount  构建离屏的 Dom 树
        // 1. 构建 Dom
        // const instance = createInstance(wip.type, newProps)
        const instance = createInstance(wip.type)
        // 2. 将Dom插入到Dom树中
        appendAllChildren(instance, wip)
        wip.stateNode = instance
      }
      bubbleProperties(wip)
      return null
    case HostText:
      if (current !== null && wip.stateNode) {
        //update
      } else {
        // mount
        // 1. 构建 Dom
        const instance = createTextInstance(newProps.content)
        wip.stateNode = instance
      }
      bubbleProperties(wip)
      return null
    case HostRoot:
      bubbleProperties(wip)
      return null
    case FunctionComponent:
      bubbleProperties(wip)
      return null
    default:
      if (__DEV__) {
        console.warn('completeWork未实现的类型', wip)
      }
      return null
  }
}

/** 节点的插入方法 */
function appendAllChildren(parent: Container, wip: FiberNode) {
  let node = wip.child

  // 递归插入
  while (node !== null) {
    if (node?.tag === HostComponent || node?.tag === HostText) {
      // 插入原生 DOM 元素节点或文本节点
      appendInitialChild(parent, node?.stateNode)
    } else if (node.child !== null) {
      // 递归处理其他类型的组件节点的子节点
      node.child.return = node
      node = node.child
      continue
    }

    // 终止条件
    if (node === wip) {
      return
    }

    // 子节点结束，开始处理兄弟节点
    while (node.sibling === null) {
      // 1.当前节点无兄弟节点
      if (node.return === null || node.return === wip) {
        return
      }
      node = node?.return
    }
    // 2.当前节点有兄弟节点
    node.sibling.return = node.return
    node = node.sibling
  }
}

/** 收集更新 flags，将子 FiberNode 的 flags 冒泡到父 FiberNode 上 */
function bubbleProperties(wip: FiberNode) {
  let subtreeFlags = NoFlags
  let child = wip.child

  while (child !== null) {
    subtreeFlags |= child.subtreeFlags
    subtreeFlags |= child.flags

    child.return = wip
    child = child.sibling
  }
  wip.subtreeFlags |= subtreeFlags
}
