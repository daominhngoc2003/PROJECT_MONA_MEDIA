
const CartReducer = (state: any, action: { payload: any, type: string }) => {
    switch (action.type) {
        case "cart/getCartByUser":
            state.carts = action.payload;
            break;
        case "cart/addToCart":
            state.carts?.products?.push(action.payload)
            break;
        case "cart/deleteAllProductCart":
            state.carts.products = [];
            break;
        case "cart/update":
            const product = action.payload;
            state.carts = state?.carts?.products?.map((item: any) => item.product_id._id === product._id ? product : item)
            break;
        case "cart/delete":
            const id = action.payload;
            console.log(id);

            const data = state?.carts?.products.find((item: any) => item.product_id._id !== id);
            console.log("s", data);
            state.carts.products = data;
            break;
        default:
            return state;
    }
}

export default CartReducer