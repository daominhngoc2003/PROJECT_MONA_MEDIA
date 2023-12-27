import { createContext, useReducer } from "react";
import ProductReducer from "../store/ProductReducer";
import { produce } from "immer";
import { IProduct } from "../types/Product";

export const ProductContext = createContext({} as any);

type Props = {
    children: React.ReactNode
}

const initialState = {
    products: []
} as { products: IProduct[] }

const ProductProvider = ({ children }: Props) => {
    const [state, dispatch] = useReducer(produce(ProductReducer), initialState)
    return (
        <ProductContext.Provider value={{ state, dispatch }}>{children}</ProductContext.Provider>
    )
}

export default ProductProvider