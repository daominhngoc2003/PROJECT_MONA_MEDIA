export interface ISignup {
    _id?: string,
    user_fullName: string,
    user_phone?: number,
    user_email: string,
    user_password: string,
    user_confirmPassword?: string,
    user_role?: string,
}
export interface ISignin {
    _id?: string,
    user_email: string,
    user_password: string,
}