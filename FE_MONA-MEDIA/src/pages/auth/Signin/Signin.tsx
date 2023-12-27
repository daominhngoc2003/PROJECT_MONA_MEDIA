// import "./css/Signin.scss"
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import { ISignin } from "../../../types/Auth";
import { AuthContext } from "../../../provider/AuthReducer";
import { useContext, useState } from "react";
import { SigninUser } from "../../../api/Auth";
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from "antd";
import Swal from "sweetalert2";
import VerifyEmail from "./components/VerifyEmail";

const Signin = () => {
    const { register, handleSubmit } = useForm<ISignin>();
    const navigate = useNavigate();
    const { dispatch } = useContext(AuthContext);
    const [isLoading, setIsloading] = useState(false);
    const [email, setEmail] = useState('');
    const [open, setOpen] = useState(false);

    const onHandleSubmit = async (values: ISignin) => {
        setIsloading(true)
        try {
            const { data } = await SigninUser(values);
            if (data.success === true) {
                await dispatch({ type: "auth/login", payload: data })
                toast.success(data.message);
                await localStorage.setItem("accessToken", JSON.stringify(data?.accessToken));
                navigate("/");
                // const users = data;
                // await localStorage.setItem("accessToken", JSON.stringify(users));
                // if (users?.user?.user_role === "admin") {
                //     navigate("/admin");
                // } else {
                //     navigate("/");
                // }
                window.location.reload();
            } else if (data.success === 1) {
                setEmail(values?.user_email);
                Swal.fire({
                    title: "Tài khoản chưa được kích hoạt",
                    text: `${data.message}`,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Đồng ý!"
                }).then((result) => {
                    if (result.isConfirmed) {
                        // navigate("/register/verify-email");
                        setOpen(true)
                        // Swal.fire({
                        //     title: "Deleted!",
                        //     text: "Your file has been deleted.",
                        //     icon: "success"
                        // });
                    }
                });
            } else {
                Swal.fire({
                    title: 'Opps!',
                    text: `${data.message}`,
                    icon: 'error',
                    confirmButtonText: 'Quay lại'
                })
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            setIsloading(false)
        }
    };

    return (
        <div>
            {isLoading && (
                <div className="fixed inset-0 bg-black opacity-50 z-50"></div>
            )}

            {/* Spin component */}
            {isLoading && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                    <Spin className="bg-white rounded-full p-5" indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                </div>
            )}
            <VerifyEmail setOpen={setOpen} open={open} email={email} />
            <section className="login-section max-w-[600px] my-10 mx-auto border py-4 px-10 rounded-[10px] shadow min-h-[400px]">
                <div className="login-wrapper">
                    <div className="form-login">
                        <h4 className="login-title text-center text-[30px]">
                            Đăng nhập
                        </h4>
                        <form action="#"
                            onSubmit={handleSubmit(onHandleSubmit)} method="POST" id="login-form">
                            <div className="login-name mb-2">
                                <label htmlFor="email">Email *</label> <br />
                                <input type="text"
                                    className="w-full outline-none border rounded-sm px-2 py-2 shadow-sm"
                                    {...register("user_email")} placeholder="Bạn nhập email" required />
                            </div>
                            <div className="login-password mb-2">
                                <label htmlFor="password">Mật khẩu *</label> <br />
                                <input type="password"
                                    className="w-full outline-none border rounded-sm px-2 py-2 shadow-sm"
                                    {...register("user_password")} placeholder="Bạn nhập mật khẩu" required />
                            </div>
                            <div className="login-flex mb-2 flex">
                                <div className="htmlForm-remember">
                                    <input type="checkbox" id="htmlForm-check" />
                                    <label htmlFor="htmlForm-check">Nhớ tài khoản</label>
                                </div>
                                <div className="htmlForgot-password">
                                    <Link to="/forget-password">Quên mật khẩu?</Link>
                                </div>
                            </div>
                            <div className="htmlForm-register">
                                <Link to="/signup">Tạo tài khoản</Link>
                            </div>
                            <div className="">
                                <button
                                    className="w-full hover:bg-white py-2 hover:border-black hover:text-black border-2 cursor-pointer bg-black text-center rounded-[10px] hover:shadow transition-all text-white block"
                                    type="submit" id="submite-btn">ĐĂNG NHẬP</button>
                            </div>
                        </form>
                        <div className="form-login-other mt-2 ">
                            <h5 className="text-center mt-4 mb-2">or login WITH</h5>
                            <ul className="grid grid-cols-[50%,50%] gap-3">
                                <li className="w-full  bg-[#3a4db4] rounded-md">
                                    <Link to="#"
                                        className="facebook-login w-full text-white block text-center py-3">
                                        <i className="fa-brands fa-facebook"></i>
                                        Signup with facebook</Link></li>
                                <li
                                    className="bg-[#c93701] rounded-md text-center py-3 text-white" >
                                    <Link to="#"
                                        className="google-login w-full text-white block">
                                        <i className="fa-brands fa-google"></i> Signup with google</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Signin