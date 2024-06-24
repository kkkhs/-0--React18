import { ReactElementType } from 'shared/ReactTypes'
import { FiberNode } from './fiber'
import { UpdateQueue, processUpdateQueue } from './updateQueue'
import { HostComponent, HostRoot, HostText } from './workTags'
import { mountChildFibers, reconcileChildFibers } from './childFibers'

/**
 * 递归中的递阶段
 *
 * 比较，然后返回子fiberNode
 *  */
export const beginWork = (wip: FiberNode) => {
  switch (wip.tag) {
    case HostRoot:
      return updateHostRoot(wip)
    case HostComponent:
      return updateHostComponent(wip)
    case HostText:
      return null
    default:
      if (__DEV__) {
        console.warn('beginWork为实现的类型', wip)
      }
      break
  }
}

/** 处理根节点的更新，包括协调处理根节点的属性 以及子节点的更新逻辑 */
function updateHostRoot(wip: FiberNode) {
  const baseState = wip.memoizedState
  const updateQueue = wip.updateQueue as UpdateQueue<Element>
  const pending = updateQueue.shared.pending
  updateQueue.shared.pending = null // 清空更新链表

  // 1.计算状态的最新值
  const { memoizedState } = processUpdateQueue(baseState, pending) // 计算待更新状态的最新值
  wip.memoizedState = memoizedState // 更新协调后的状态最新值

  // 2. 创造子fiberNode
  const nextChildren = wip.memoizedState // 获取 children 属性
  reconcileChildren(wip, nextChildren) // 处理根节点的子节点，可能会递归调用其他协调函数；

  // 返回经过协调后的新的子节点链表
  return wip.child
}

function updateHostComponent(wip: FiberNode) {
  const nextProps = wip.pendingProps
  //  创造子fiberNode
  const nextChildren = nextProps.children // 获取Dom的children属性
  reconcileChildren(wip, nextChildren) // 处理原生 DOM 元素的子节点更新，可能会递归调用其他协调函数；

  return wip.child
}

/** 通过对比子节点的 current FiberNode 与 子节点的 ReactElement，来生成子节点对应的 workInProgress FiberNode */
function reconcileChildren(wip: FiberNode, children?: ReactElementType) {
  const current = wip.alternate

  if (current !== null) {
    // update
    wip.child = reconcileChildFibers(wip, current?.child, children)
  } else {
    // mount
    wip.child = mountChildFibers(wip, null, children)
  }
}
