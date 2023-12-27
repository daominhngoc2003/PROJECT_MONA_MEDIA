
const RoleReducer = (state: any, action: { payload: any, type: string }) => {
    switch (action.type) {
        case "role/search":
            state.roles = action.payload;
            break;
        case "role/getDetail":
            state.roles = action.payload;
            break;
        case "role/add":
            state.roles.push(action.payload)
            break;
        case "role/update":
            const role = action.payload;
            state.roles = state?.roles?.roles?.map((item: any) => item._id === role._id ? role : item)
            break;
        case "role/delete":
            const id = action.payload;
            state.roles = state?.roles?.filter((item: any) => item._id !== id)
            break;
        default:
            return state;
    }
}

export default RoleReducer