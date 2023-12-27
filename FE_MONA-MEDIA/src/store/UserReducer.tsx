
const UserReducer = (state: any, action: { payload: any, type: string }) => {
    switch (action.type) {
        case "user/getall":
            state.users = action.payload;
            break;
        case "user/getUserById":
            state.users = action.payload;
            break;
        case "user/register":
            state.users.push(action.payload)
            break;
        case "user/update":
            const user = action.payload;
            state.users = state?.users?.map((item: any) => item._id === user._id ? user : item)
            break;
        case "user/delete":
            const id = action.payload;
            state.users = state?.users?.filter((item: any) => item._id !== id)
            break;
        default:
            return state;
    }
}

export default UserReducer