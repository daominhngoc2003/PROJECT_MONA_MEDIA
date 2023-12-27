import { IResetPassword, IUser } from "../types/User";
import { instance } from "./instance";

export const SearchUser = (data: any) => {
    return instance.get(`/users?_page=${data?.currentPages}&_keywords=${data?._keywords}&_limit=${data?._limit}`);
}

export const AddUser = (user: any) => {
    return instance.post(`/users`, user);
}

export const BanUser = (user: any) => {
    return instance.put(`/users/ban/${user?._id}`, user);
}

export const GetAllUser = () => {
    return instance.get('/users');
}

export const GetUserById = (id: any) => {
    return instance.get('/users/' + id);
}

export const UpdateUser = (user: IUser) => {
    return instance.put(`/users/` + user._id, user);
}

export const DeleteUser = (_id: string) => {
    return instance.delete(`/users/` + _id);
}

export const LogoutUser = () => {
    localStorage.clear();
    window.location.reload();
}

export const ForgetPassword = (email: string) => {
    return instance.post("/users/forget-password", email)
}

export const VerifyEmailCode = (emailToken: object) => {
    return instance.post("/users/verify-email", emailToken)
}

export const ResetPassword = (data: IResetPassword) => {
    return instance.post("/users/reset-password", data)
}