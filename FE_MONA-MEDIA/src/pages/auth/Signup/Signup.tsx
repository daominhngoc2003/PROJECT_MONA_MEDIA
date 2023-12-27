// import "./css/Signup.scss"
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import { SignupUser } from "../../../api/Auth";

const Signup = () => {
    const { register, handleSubmit } = useForm<any>();
    const navigate = useNavigate();
    const onHandleSubmit = async (user: any) => {
        try {
            const { data } = await SignupUser(user);
            console.log(data);

            if (data.success) {
                toast.success(data.message)
                navigate("/signin")
            }
            // if (!data.user) {
            //     toast.error(data.message)
            // }
            // toast.success(data.message)
            // navigate("/signin")
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }
    return (
        <div>
            <section className="signup-section max-w-[600px] bg-gray-50 my-10 px-10 py-4 mx-auto border rounded-md shadow border-gray-100">
                <div className="signup-wrapper">
                    <div className="form-signup">
                        <h4 className="signup-title text-center text-[30px]">
                            Đăng ký
                        </h4>
                        <form action="#" method="POST" onSubmit={handleSubmit(onHandleSubmit)} id="signup-form">
                            <div className="signup-Last mb-2">
                                <label htmlFor="name">Họ tên *</label> <br />
                                <input type="text"
                                    className="w-full outline-none border rounded-sm px-2 py-2 shadow-sm"
                                    {...register("user_fullname")} placeholder="Your last full name" required />
                            </div>
                            <div className="signup-Last mb-2">
                                <label htmlFor="name">User Name *</label> <br />
                                <input type="text"
                                    className="w-full outline-none border rounded-sm px-2 py-2 shadow-sm"
                                    {...register("user_username")} placeholder="Your last user name" required />
                            </div>
                            <div className="signup-email mb-2">
                                <label htmlFor="email">Email *</label> <br />
                                <input type="email"
                                    className="w-full outline-none border rounded-sm px-2 py-2 shadow-sm"
                                    {...register("user_email")} placeholder="Your email name" required />
                            </div>
                            <div className="signup-password mb-2">
                                <label htmlFor="password">Password *</label> <br />
                                <input type="password"
                                    className="w-full outline-none border rounded-sm px-2 py-2 shadow-sm"
                                    {...register("user_password")} placeholder="Enter your password" required />
                            </div>
                            <div className="signup-confirmPassword mb-2">
                                <label htmlFor="confirmPassword">Xác nhận mật khẩu *</label> <br />
                                <input type="password"
                                    className="w-full outline-none border rounded-sm px-2 py-2 shadow-sm"
                                    {...register("user_confirmPassword")} placeholder="Enter your confirmPassword"
                                    required />
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <div>
                                    <Link to={""}>Quên mật khẩu</Link>
                                </div>
                                <div>
                                    <Link className="text-blue-500" to={"/signin"}>Đăng nhập</Link>
                                </div>
                            </div>
                            {/* <div className="signup-flex mb-2">
                                <div className="form-remember">
                                    <input type="checkbox" id="form-check" />
                                    <label htmlFor="form-check">I agree to the Terms & Policy</label>
                                </div>
                            </div> */}
                            <div className="btn-submit">
                                <button
                                    className="w-full hover:bg-white py-2 hover:border-black hover:text-black border-2 cursor-pointer bg-black text-center rounded-[10px] hover:shadow transition-all text-white block"
                                    type="submit" id="submite-btn">TẠO TÀI KHOẢN</button>
                            </div>
                        </form>
                        {/* <div className="form-signup-other">
                            <h5>or signup WITH</h5>
                            <ul>
                                <li><Link to="#" className="facebook-signup"><i className="fa-brands fa-facebook"></i>
                                    Signup whit facebook</Link></li>
                                <li><Link to="#" className="google-signup"><i className="fa-brands fa-google"></i> Signup with google</Link></li>
                            </ul>
                        </div> */}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Signup