import { createContext, useReducer } from 'react'

export const InstructorsContext = createContext()
const initialState = { userx: null , userType:null };
export const instructorsReducer = (state, action) => {
    switch (action.type) {
      case 'SET_INSTRUCTORS':
        return { 
            instrcutors: action.payload 
        }
      case 'CREATE_INSTRUCTORS':
        return { 
            instrcutors: [ ...state.instrcutors] 
        }

        case 'LOG_OUT':
            return { 
                userx: null,
                userType: null
            }
        case 'GET_USER':
        return { 
            userx: action.payload,
            userType: action.payload.role
        }
      default:
        return state
    }
  }
  
  export const InstructorsContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(instructorsReducer,initialState);
    const value = { state, dispatch };
    return (
      <InstructorsContext.Provider value={value}>
        { children }
      </InstructorsContext.Provider>
    )
  }