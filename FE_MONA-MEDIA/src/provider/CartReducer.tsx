import { createContext, useReducer } from "react";
import { produce } from "immer";
import CartReducer from "../store/CartReducer";

export const CartContext = createContext({} as any);


type Props = {
    children: React.ReactNode
}

const initialState = {
    carts: []
}

const CartProvider = ({ children }: Props) => {
    const [state, dispatch] = useReducer(produce(CartReducer), initialState)
    return (
        <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>
    )
}

export default CartProvider