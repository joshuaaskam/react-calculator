import { useReducer } from 'react';
import DigitButton from './DigitButton.js';
import OperationButton from './OperationButton.js';
import './styles.css';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

function reducer(state, {type, payload}){
  switch(type){
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite){
        return{
          ...state,
          overwrite: false,
          currentOperand: payload.digit,
        }
      }
      // Do not allow redundant 0s to be added
      if(payload.digit === "0" && state.currentOperand === "0") {
        return state
      }
      // Replace a single 0 with the digit
      if(state.currentOperand === "0" && payload.digit !== "0" && payload.digit !== "."){
        return{
          ...state,
          currentOperand: payload.digit
        }
      }
      // Do not allow multiple decimals in a number
      if(payload.digit === "." && state.currentOperand.includes(".")) {
        return state
      }
      return{
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      }
    case ACTIONS.CHOOSE_OPERATION:
      if(state.currentOperand == null && state.previousOperand == null){
        return state
      }
      if(state.currentOperand == null){
        return {
          ...state,
          operation: payload.operation
        }
      }
      if(state.previousOperand == null){
        return{
          ...state,
          operation:payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        }
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      }
    case ACTIONS.CLEAR:
      return {}
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite){
        return{
          ...state,
          overwrite: false,
          currentOperand: null,
        }
      }
      if(state.currentOperand == null){
        return state
      }
      if(state.currentOperand.length === 1){
        return{
          ...state,
          currentOperand: null,
        }
      }
      return{
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }
    case ACTIONS.EVALUATE:
      if(state.currentOperand == null || state.previousOperand == null || state.operation == null){
        return state
      }
      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      }
    default:
      break
  }
}

function evaluate( {currentOperand, previousOperand, operation}){
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if(isNaN(prev) || isNaN(current)){
    return ""
  }
  let calculation = ""
  switch(operation){
    case "+":
      calculation = prev + current
      break
    case "-":
      calculation = prev - current
      break
    case "÷":
      calculation = prev / current
      break
    case "*":
      calculation = prev * current
      break
    default:
      break
  }

  return calculation.toString()
}

function App() {
  const [{currentOperand, previousOperand, operation} , dispatch] = useReducer(reducer, {})

  return (
    <div className='calculator-grid'>
      <div className='output'>
        <div className='previous-operand'>
          {previousOperand} {operation}
        </div>
        <div className='current-operand'>{currentOperand}</div>
      </div>
      <button className='span-two' onClick={() => dispatch({type: ACTIONS.CLEAR})}>AC</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT})}>DEL</button>
      <OperationButton operation="÷" dispatch={dispatch}/>
      <DigitButton digit="1" dispatch={dispatch}/>
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch}/>
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch}/>
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch}/>
      <DigitButton digit="0" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <button className='span-two' onClick={() => dispatch({ type: ACTIONS.EVALUATE})}>=</button>
    </div>
  );
}

export default App;
