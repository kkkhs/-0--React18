/**
 * FiberNode 的节点类型
 */
export type WorkTag =
  | typeof FunctionComponent
  | typeof HostComponent
  | typeof HostComponent
  | typeof HostText

export const FunctionComponent = 0
export const HostRoot = 3
// <div></div>
export const HostComponent = 5
export const HostText = 6
