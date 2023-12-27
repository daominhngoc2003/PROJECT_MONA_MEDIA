import { ISignin, ISignup } from "../types/Auth";
import { instance } from "./instance";



export const SigninUser = (user: ISignin) => {
    return instance.post(`/auth/signin`, user);
}

export const SignupUser = (user: ISignup) => {
    return instance.post(`/auth/signup`, user);
}

export const VerifyUser = (user: ISignup) => {
    return instance.post(`/auth/verify`, user);
}

export const ResetCodeVerifyUser = (user: ISignup) => {
    return instance.post(`/auth/reset-token`, user);
}