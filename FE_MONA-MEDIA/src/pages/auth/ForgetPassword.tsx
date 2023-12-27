import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"

const ForgetPasswordPage = ({ onForgetPass }: any) => {
    const { handleSubmit, register } = useForm();

    const onHandleSubmit = (value: any) => {
        onForgetPass(value);
    }
    return (
        <div>
            <section className="login-section">
                <div className="login-wrapper">
                    <div className="form-login">
                        <h4 className="login-title">
                            Quên mật khẩu
                        </h4>
                        <form action="#" onSubmit={handleSubmit(onHandleSubmit)} method="POST" id="login-form">
                            <div className="login-name">
                                <label htmlFor="email">Email *</label> <br />
                                <input type="email" {...register("email")} id="email" placeholder="Your email" required />
                            </div>

                            <div className="form-register">
                                <Link to="/signin">Đăng nhập</Link>
                            </div>
                            <div className="btn-submit">
                                <button type="submit" id="submite-btn">GỬI</button>
                            </div>
                        </form>
                        <div className="form-login-other">
                            <h5>or login WITH</h5>
                            <ul>
                                <li><Link to="#" className="facebook-login"><i className="fa-brands fa-facebook"></i>
                                    Signup whit facebook</Link></li>
                                <li><Link to="#" className="google-login"><i className="fa-brands fa-google"></i> Signup
                                    with google</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ForgetPasswordPage