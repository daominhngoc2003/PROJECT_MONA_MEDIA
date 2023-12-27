import { createContext, useReducer } from "react";
import { produce } from "immer";
import CategoryReducer from "../store/CategoryReducer";

export const CategoryContext = createContext({} as any);


type Props = {
    children: React.ReactNode
}

const initialState = {
    categories: []
}

const CategoryProvider = ({ children }: Props) => {
    const [state, dispatch] = useReducer(produce(CategoryReducer), initialState)
    return (
        <CategoryContext.Provider value={{ state, dispatch }}>{children}</CategoryContext.Provider>
    )
}

export default CategoryProvider