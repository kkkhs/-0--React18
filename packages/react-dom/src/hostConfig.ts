/**
 * 描述数组环境方法
 */

export type Container = Element
export type Instance = Element

/** 创建Dom实例 */
// export const createInstance = (type: string, props: any): Instance => {
export const createInstance = (type: string): Instance => {
  // TODO 处理props
  const element = document.createElement(type)
  return element
}

/** Dom 的插入 */
export const appendInitialChild = (
  parent: Instance | Container,
  child: Instance
) => {
  parent.appendChild(child)
}

/** 创建Text 节点 */
export const createTextInstance = (content: string) => {
  return document.createTextNode(content)
}

/** 插入节点 */
export const appendChildToContainer = appendInitialChild
