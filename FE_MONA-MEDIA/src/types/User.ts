// export interface ISignin {
//     _id?: string,
//     email: string,
//     password: string,
// }

// export interface ISignup {
//     _id?: string,
//     name: string,
//     email: string,
//     password: string,
//     confirmPassword: string,
// }

// export interface IUser {
//     _id?: string,
//     name: string,
//     email: string,
//     avatar: string,
//     phone: number,
//     address: string,
//     status: string,
//     role: string,
// }
export interface IUser {
    _id?: string | any,
    user_fullname: string,
    user_username: string,
    user_phone?: number,
    user_email: string,
    user_password: string,
    user_confirmPassword?: string,
    user_role?: string,
    user_avatar?: string,
    user_status: string;
    user_address: string;
    user_gender: string;
    verifyToken: any
}

export interface IResetPassword {
    _id?: string,
    email: string
    verifyToken: string
    password: string
}