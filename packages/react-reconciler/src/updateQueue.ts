import { Action } from 'shared/ReactTypes'
import { Update } from './fiberFlags'

export interface Update<State> {
  action: Action<State>
}

export interface UpdateQueue<State> {
  shared: {
    pending: Update<State> | null
  }
}

/** 创建 Update */
export const createUpdate = <State>(action: Action<State>): Update<State> => {
  return {
    action,
  }
}

/** 创建 UpdateQueue */
export const createUpdateQueue = <Action>() => {
  return {
    shared: {
      pending: null,
    },
  } as UpdateQueue<Action>
}

/** updateQueue添加update */
export const enqueueUpdate = <Action>(
  updateQueue: UpdateQueue<Action>,
  update: Update<Action>
) => {
  updateQueue.shared.pending = update
}

/** updateQueue消费update */
export const processUpdateQueue = <State>(
  baseState: State, // 初始状态
  pendingUpdate: Update<State> | null // 要消费的Update
): { memoizedState: State } => {
  const result: ReturnType<typeof processUpdateQueue<State>> = {
    memoizedState: baseState,
  }

  if (pendingUpdate !== null) {
    const action = pendingUpdate.action
    if (action instanceof Function) {
      // baseState:1, update:(x)=>4*x  ——> memoizedState:4
      result.memoizedState = action(baseState)
    } else {
      // baseState:1, update:2  ——>  memoizedState:2
      result.memoizedState = action
    }
  }

  return result
}
