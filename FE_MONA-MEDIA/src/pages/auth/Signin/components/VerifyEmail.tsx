
import { Modal, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ResetCodeVerifyUser, VerifyUser } from '../../../../api/Auth';
import { GrPowerReset } from "react-icons/gr"
import { toast } from 'react-toastify';
import { IUser } from '../../../../types/User';
import { LoadingOutlined } from '@ant-design/icons';

const VerifyEmail = ({ setOpen, open, email }: any) => {
    const handleCancel = () => {
        setOpen(false);
    };
    const [spinning, setSpinning] = useState<boolean>(false);
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<IUser>();

    useEffect(() => {
        setValue("user_email", email)
    }, [email])

    const onReset = async () => {
        setSpinning(true)
        try {
            const user_email: any = { user_email: email }
            await ResetCodeVerifyUser(user_email);
        } catch (error) {
            console.log(error);
        } finally {
            setSpinning(false)
        }
    }

    const onSubmit = async (value: any) => {
        setSpinning(true);
        try {

            const { data }: any = await VerifyUser(value);
            if (data.success === true) {
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error: any) {
            console.log(error);
            toast.error(error.response.data.message)
        } finally {
            setSpinning(false);
        }
    };
    return (
        <Modal
            title="Kích hoạt tài khoản"
            open={open}
            // onOk={handleOk}
            onCancel={handleCancel}
            okButtonProps={{ disabled: false, className: 'text-black border border-black', style: { display: 'none' } }}
            cancelButtonProps={{ disabled: false, style: { display: 'none' } }}
            width={600}
            className='mt-[-40px]'
        >
            {spinning && (
                <div className="fixed inset-0 bg-black opacity-50 z-50"></div>
            )}

            {/* Spin component */}
            {spinning && (
                <div className="fixed top-1/2 left-1/2 bg-white rounded-full  transform -translate-x-1/2 -translate-y-1/2 z-50">
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                </div>
            )}
            <form action="#" className=" grid grid-cols-6 gap-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="col-span-3 sm:col-span-6">
                    <label
                        htmlFor="Email"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Email
                    </label>

                    <input
                        type="text"
                        id="user_email"
                        {...register("user_email", {
                            required: "Email không được bỏ trống",
                        })}
                        disabled
                        name="user_email"
                        placeholder="ngoc@gmail.com"
                        className="py-3 bg-gray-50 mt-2 outline-none border px-2 w-full rounded-md border-gray-200  text-sm text-gray-700 shadow-sm"
                    />
                </div>

                <div className="col-span-6">
                    <div className=" sm:flex sm:items-center sm:gap-4">
                        <p>Mã xác minh</p>
                        <input type="text"
                            {...register("verifyToken", { required: "mã xác minh không được bỏ trống không được bỏ trống", })}

                            className="border outline-none px-2 py-1 w-[150px] rounded-sm shadow"
                            placeholder="Mã xác minh " />

                        <p className="cursor-pointer" onClick={onReset}><GrPowerReset /></p>
                    </div>
                    <div className="text-red-500 text-[14px] absolute">
                        {errors?.verifyToken && errors?.verifyToken?.message as any}
                    </div>
                </div>

                <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                    <button
                        disabled={spinning}
                        className="inline-block w-full shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
                    >
                        {spinning ? (<>
                            Đang xác minh <Spin />
                        </>) : "Xác minh"}
                    </button>
                </div>
            </form>
        </Modal >
    );
};

export default VerifyEmail;
