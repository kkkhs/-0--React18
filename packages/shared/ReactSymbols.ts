/**
 *  防止比别人滥用ReactElement， 所以要将ReactElement定义为独一无二的Symbol对象
 */

// 先判断当前的环境是否支持Symbol
const supportSymbol = typeof Symbol === 'function' && Symbol.for

export const REACT_ELEMENT_TYPE = supportSymbol
  ? Symbol.for('react.element')
  : 0xeac7
