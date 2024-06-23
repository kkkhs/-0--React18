/**
 * 整体 reconciler 的工作循环
 */

import { beginWork } from './beginWork'
import { completeWork } from './completeWork'
import { FiberNode, FiberRootNode, createWorkInProgress } from './fiber'
import { HostRoot } from './workTags'

/** 指向当前正在工作的 fiberNode */
let workInProgress: FiberNode | null = null

/** 初始化 */
function prepareFreshStack(root: FiberRootNode) {
  workInProgress = createWorkInProgress(root.current, {})
}

/** 实现在 updateContainer后进入wordLoop更新流程 */
export function scheduleUpdateOnFiber(fiber: FiberNode) {
  // TODO 调度功能
  // fiberRootNode 先找到当前触发更新节点的根节点
  const root = markUpdateFromFiberToRoot(fiber)
  renderRoot(root)
}

/** 从当前fiber找到根fiber */
function markUpdateFromFiberToRoot(fiber: FiberNode) {
  let node = fiber
  let parent = node.return
  while (parent !== null) {
    // 往上找
    node = parent
    parent = node.return
  }

  if (node.tag === HostRoot) {
    return node.stateNode
  }
  return null
}

/** reconciler最终执行的方法 */
function renderRoot(root: FiberRootNode) {
  prepareFreshStack(root)

  // 开始更新流程: 递归
  do {
    try {
      workLoop()
      break
    } catch (error) {
      console.warn('workLoop发生错误')
      workInProgress = null
    }
  } while (true)
}

function workLoop() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress)
  }
}

function performUnitOfWork(fiber: FiberNode) {
  const next = beginWork(fiber) // 递
  fiber.memoizedProps = fiber.pendingProps
  if (next === null) {
    completeUnitOfWork(fiber) // 归
  } else {
    workInProgress = next // 继续执行workLoop, 向下遍历
  }
}

function completeUnitOfWork(fiber: FiberNode) {
  let node: FiberNode | null = fiber

  do {
    const next = completeWork(node) // 归返回兄弟节点
    const sibling = node.sibling

    if (sibling !== null) {
      // 兄弟节点存在
      workInProgress = sibling
      return
    }

    // 兄弟节点不存在
    node = node.return
    workInProgress = node
  } while (node !== null)
}
