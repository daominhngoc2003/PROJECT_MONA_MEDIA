
const AuthReducer = (state: any, action: { payload: any, type: string }) => {
    switch (action.type) {
        case "auth/login":
            return { ...state, user: action.payload };
        case "auth/signup":
            console.log(action.payload);
            state.users.push(action.payload);
            break;
        case "auth/logout":
            state.users = []
            break;
        default:
            return state;
    }
}

export default AuthReducer