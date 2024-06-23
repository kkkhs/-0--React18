/***
 * 存放 React 各种类型
 */

export type Type = any
export type Key = any
export type Ref = any
export type Props = any
export type ElementType = any

export interface ReactElementType {
  $$typeof: symbol | number
  type: ElementType
  key: Key
  ref: Ref
  props: Props
  __mark: string
}

/** useState支持的两种dispatch参数 */
export type Action<State> = State | ((prevState: State) => State)
