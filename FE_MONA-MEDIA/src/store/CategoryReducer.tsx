
const CategoryReducer = (state: any, action: { payload: any, type: string }) => {
    switch (action.type) {
        case "category/getall":
            state.categories = action.payload;
            break;
        case "category/search":
            state.categories = action.payload;
            break;
        case "category/add":
            state.categories.push(action.payload)
            break;
        case "category/update":
            const product = action.payload;
            state.categories = state?.categories?.map((item: any) => item._id === product._id ? product : item)
            break;
        case "category/delete":
            const id = action.payload;
            state.categories = state?.categories?.filter((item: any) => item._id !== id)
            break;
        default:
            return state;
    }
}

export default CategoryReducer