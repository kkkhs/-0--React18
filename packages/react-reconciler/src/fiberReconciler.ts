import { Container } from 'hostConfig'
import { FiberNode, FiberRootNode } from './fiber'
import { HostRoot } from './workTags'
import {
  UpdateQueue,
  createUpdate,
  createUpdateQueue,
  enqueueUpdate,
} from './updateQueue'
import { ReactElementType } from 'shared/ReactTypes'
import { scheduleUpdateOnFiber } from './workLoop'

export function createContainer(container: Container) {
  // 1.新建 hostRootFiber
  const hostRootFiber = new FiberNode(HostRoot, {}, null)
  // 2.新建 fiberRootNode
  const root = new FiberRootNode(container, hostRootFiber)
  // 3.初始化hostRootFiber的updateQueue
  hostRootFiber.updateQueue = createUpdateQueue()

  return root
}

export function updateContainer(
  element: ReactElementType | null,
  root: FiberRootNode
) {
  // 1.获取 hostRootFiber
  const hostRootFiber = root.current
  // 2.新建 update
  const update = createUpdate<ReactElementType | null>(element)
  // 3.将该 update 插入到 hostRootFiber的updateQueue中
  enqueueUpdate(
    hostRootFiber.updateQueue as UpdateQueue<ReactElementType | null>,
    update
  )

  // 进入wordLoop更新流程
  scheduleUpdateOnFiber(hostRootFiber)

  return element
}
