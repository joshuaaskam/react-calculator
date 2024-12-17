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
    case ACTIONS.CLEAR:
      return {}
    default:
      break
  }
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
      <button>DEL</button>
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
      <button className='span-two'>=</button>
    </div>
  );
}

export default App;
