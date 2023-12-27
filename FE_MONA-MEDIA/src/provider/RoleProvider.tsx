import { createContext, useReducer } from "react";
import { produce } from "immer";
import RoleReducer from "../store/RoleReducer";

export const RoleContext = createContext({} as any);

type Props = {
    children: React.ReactNode
}

const initialState = {
    roles: []
} as { roles: any[] }

const RoleProvider = ({ children }: Props) => {
    const [state, dispatch] = useReducer(produce(RoleReducer), initialState)
    return (
        <RoleContext.Provider value={{ state, dispatch }}>{children}</RoleContext.Provider>
    )
}

export default RoleProvider