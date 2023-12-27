import { createContext, useReducer } from "react";
import { produce } from "immer";
import UserReducer from "../store/UserReducer";

export const UserContext = createContext({} as any);


type Props = {
    children: React.ReactNode
}

const initialState = {
    users: []
}

const UserProvider = ({ children }: Props) => {
    const [state, dispatch] = useReducer(produce(UserReducer), initialState)
    return (
        <UserContext.Provider value={{ state, dispatch }}>{children}</UserContext.Provider>
    )
}

export default UserProvider