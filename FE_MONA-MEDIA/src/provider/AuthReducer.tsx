import { createContext, useReducer } from "react";
import { produce } from "immer";
import AuthReducer from "../store/AuthReducer";

export const AuthContext = createContext({} as any);


type Props = {
    children: React.ReactNode
}

const initialState = {
    auths: []
}

const AuthProvider = ({ children }: Props) => {
    const [state, dispatch] = useReducer(produce(AuthReducer), initialState)
    return (
        <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>
    )
}

export default AuthProvider