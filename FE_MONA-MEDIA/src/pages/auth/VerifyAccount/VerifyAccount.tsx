import { useForm } from "react-hook-form";
import "./VerifyAccount.css";
import { VerifyUser } from "../../../api/Auth";
import { toast } from "react-toastify";

const VerifyAccount = () => {
    const { register, handleSubmit } = useForm();

    const onHandleSubmit = async (value: any) => {
        try {
            const datareq: any = {
                user_email: value.user_email,
                verifyToken: value.verifyToken,
            }
            const data = await VerifyUser(datareq);

            if (data) {
                console.log(1);
            }

        } catch (error: any) {
            toast.error(error?.response?.data?.message);
        }
    }
    return <div className="verify-main">
        <div>
            <h2 className="verify-title">Kích hoạt tài khoản</h2>
            <form action="" className="verify-form" onSubmit={handleSubmit(onHandleSubmit)}>
                <div>
                    <label htmlFor="">Email</label> <br />
                    <input type="text" {...register("user_email")} placeholder="Email " />
                </div>
                <div>
                    <label htmlFor="">Mã kích hoạt</label> <br />
                    <input type="text" {...register("verifyToken")} placeholder="Mã kích hoạt " />
                </div>
                <div className="btn">
                    <button className="btn-submit">Gửi</button>
                </div>
            </form>
        </div>
    </div>;
};

export default VerifyAccount;
