import { createContext, useReducer } from "react";
import { produce } from "immer";
import BillReducer from "../store/BillReducer";

export const BillContext = createContext({} as any);


type Props = {
    children: React.ReactNode
}

const initialState = {
    bills: []
}

const BillProvider = ({ children }: Props) => {
    const [state, dispatch] = useReducer(produce(BillReducer), initialState)
    return (
        <BillContext.Provider value={{ state, dispatch }}>{children}</BillContext.Provider>
    )
}

export default BillProvider