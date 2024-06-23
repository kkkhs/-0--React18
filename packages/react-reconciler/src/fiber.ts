/**
 * 用来存放 fiberNode 数据结构
 */
import { Key, Props, Ref } from '@/shared/ReactTypes'
import { WorkTag } from './workTags'
import { Flags, NoFlags } from './fibelFlags'

export class FiberNode {
  type: any
  tag: WorkTag
  pendingProps: Props
  key: Key
  stateNode: any
  ref: Ref

  return: FiberNode | null
  sibling: FiberNode | null
  children: FiberNode | null
  index: number

  memoizedProps: Props | null
  alternate: FiberNode | null
  flags: Flags

  constructor(tag: WorkTag, pendingProps: Props, key: Key) {
    // 实例属性
    this.tag = tag
    this.key = key
    this.stateNode = null // 节点对应的实际 DOM 节点或组件实例
    this.type = null // 节点的类型，可以是原生 DOM 元素、函数组件或类组件等

    //构成树状结构
    this.return = null // 父fiberNode
    this.sibling = null // 兄弟fiberNode
    this.children = null // 子fiberNode
    this.index = 0 // 同级fiber的索引

    this.ref = null

    // 作为工作单元
    this.pendingProps = pendingProps // 初始的props
    this.memoizedProps = null // 工作完成后的props

    this.alternate = null
    this.flags = NoFlags // 副作用
  }
}
