import { FiberNode } from './fiber'

/** 返回函数组件的子节点 */
export function renderWithHooks(wip: FiberNode) {
  const Component = wip.type
  const props = wip.pendingProps
  const children = Component(props)

  return children
}
