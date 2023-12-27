import { Link, useNavigate } from "react-router-dom"
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { getDecodedAccessToken } from "../../decoder";

import type { RadioChangeEvent } from 'antd';
import { Radio, Spin } from 'antd';
import { GetUserById } from "../../api/User";
import { getPaymentMethodClient } from "../../api/PaymentMethod";
import { createPayment } from "../../api/Payment";
import { DeleteProductCart } from "../../api/Cart";
import Swal from "sweetalert2";
import { CheckOut } from "../../api/Bill";
import { LoadingOutlined } from '@ant-design/icons';


const CheckoutPage = () => {
    // state
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<any>();
    const navigate = useNavigate();
    const token: any = getDecodedAccessToken();
    const user_id = token?._id;
    const [userDetail, setUser] = useState<any>({});
    const products = JSON.parse(localStorage.getItem("carts")!);
    const [paymentMethod, setPaymentMethod] = useState([]);
    const paymentMethodList = useMemo(() => paymentMethod, [paymentMethod]);
    useEffect(() => {
        const dataUser = async () => {
            const { data } = await GetUserById(user_id);
            if (data.success) {
                setUser(data.user);
            }
        }
        dataUser()
        reset(userDetail)
    }, [userDetail, reset])

    useEffect(() => {
        const dataPaymentM = async () => {
            const { data } = await getPaymentMethodClient();
            if (data.success) {
                setPaymentMethod(data.paymentMethods);
            }
        }
        dataPaymentM()
    }, [])


    // state
    const [value, setValue] = useState<any>({});
    const [isLoadingButton, setIsLoadingButton] = useState(false);

    const [couponIdRes] = useState(undefined);

    const totalPrice = products?.reduce(
        (accumulator: number, product: any) => {
            return (accumulator += product.price);
        },
        0
    );

    let shippingFee = 30000;
    let cartCouponPrice = 0;
    // Tính totalOrder dựa trên điều kiện cart_shippingFee
    const totalOrder = totalPrice > 100000 ? totalPrice : totalPrice + shippingFee;
    const [priceAppLy] = useState(totalOrder);

    const onChange = (e: RadioChangeEvent) => {
        setValue(e.target.value);
    };

    // hàm checkout
    const onCheckOut = async (users: any) => {
        setIsLoadingButton(true);
        try {
            const formCheckout: any = {
                user_id: user_id,
                bill_phone: users.user_phone,
                bill_shippingAddress: users.user_address,
                coupon_id: couponIdRes,
                bill_note: users.bill_note ? users.bill_note : undefined,
                products: products,
                payment_method: value?._id || undefined,
                bill_totalPrice: totalPrice,
                bill_totalOrder: priceAppLy - cartCouponPrice || totalPrice,
                bill_shippingFee: shippingFee,
            };
            if (value.pMethod_name == "vnpay") {
                const { data }: any = await createPayment(formCheckout);

                if (data) {
                    for (const product of products) {
                        const formRemove: any = {
                            product_id: product.product_id._id,
                            user_id: userDetail?._id,
                        };
                        await DeleteProductCart(formRemove); // Gọi mutation để xóa sản phẩm từ giỏ hàng
                    }
                    Swal.fire({
                        position: "top",
                        icon: "success",
                        title: `Đặt đơn hàng thành công`,
                        showConfirmButton: false,
                        timer: 2000,
                    });
                    window.location.href = data;
                }
            } else {
                const { data }: any = await CheckOut(formCheckout)
                if (data.success === true) {
                    for (const product of products) {
                        const formRemove = {
                            product_id: product?.product_id?._id,
                            user_id: userDetail?._id,
                        };
                        await DeleteProductCart(formRemove); // Gọi mutation để xóa sản phẩm từ giỏ hàng
                    }
                    navigate("/account/bills")
                    Swal.fire({
                        position: "top",
                        icon: "success",
                        title: `${data.message}`,
                        showConfirmButton: false,
                        timer: 2000,
                    });
                    return;
                }
            }
        } catch (error: any) {
            console.log(error);
        } finally {
            setIsLoadingButton(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onCheckOut)}
            className="md:w-[1250px] mx-auto grid md:grid-cols-[800px,auto] gap-8 px-2 mt-5 md:px-0 py-6"
        >
            {isLoadingButton && (
                <div className="fixed inset-0 bg-black opacity-50 z-50"></div>
            )}

            {/* Spin component */}
            {isLoadingButton && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                </div>
            )}
            <div className="">
                <div className="grid md:grid-cols-2 gap-5 mb-4">
                    <div className="information w-full">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="font-bold text-[20px]">Thông tin giao hàng</h2>
                            <Link
                                to="/carts"
                                className="text-yellow-500 hover:text-yellow-600 animation-all text-[16px]"
                            >
                                <i className="mr-2 fa-solid fa-right-from-bracket"></i>Quay lại
                            </Link>
                        </div>
                        <form action="">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Email"
                                    disabled
                                    {...register("user_email", {
                                        required: "Email không được bỏ trống",
                                    })}
                                    value={userDetail?.user_email}
                                    className="w-full border text-gray-600 outline-none rounded-md focus:border-b-yellow-400 animation-all px-2 py-2 mb-3"
                                />
                                <div className="text-red-500">
                                    {(errors.user_email as any) &&
                                        (errors.user_email?.message as string)}
                                </div>
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Họ và tên"
                                    {...register("user_fullname", {
                                        required: "Họ tên không được bỏ trống",
                                    })}
                                    defaultValue={userDetail?.user_fullname}
                                    className="w-full border outline-none rounded-md focus:border-b-yellow-400 animation-all px-2 py-2 mb-3"
                                />
                                <div className="text-red-500">
                                    {(errors.user_fullname as any) &&
                                        (errors.user_fullname?.message as string)}
                                </div>
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Số điện thoại"
                                    {...register("user_phone", {
                                        required: "Số điện thoại không được bỏ trống",
                                    })}
                                    defaultValue={userDetail?.user_phone}
                                    className="w-full border outline-none rounded-md focus:border-b-yellow-400 animation-all px-2 py-2 mb-3"
                                />
                                <div className="text-red-500">
                                    {(errors.user_phone as any) &&
                                        (errors.user_phone?.message as string)}
                                </div>
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Địa chỉ"
                                    {...register("user_address", {
                                        required: "Địa chỉ không được bỏ trống",
                                    })}
                                    defaultValue={userDetail?.user_address}
                                    className="w-full border outline-none rounded-md focus:border-b-yellow-400 animation-all px-2 py-2 mb-3"
                                />
                                <div className="text-red-500">
                                    {(errors.user_address as any) &&
                                        (errors.user_address?.message as string)}
                                </div>
                            </div>
                            <div>
                                <textarea
                                    id=""
                                    cols={10}
                                    {...register("bill_note")}
                                    rows={2}
                                    placeholder="Ghi chú (tùy chọn)"
                                    className="w-full border outline-none rounded-md focus:border-b-yellow-400 animation-all px-2 py-2 mb-3"
                                ></textarea>
                            </div>
                        </form>
                    </div>
                    <div className="payment">
                        {/* <div className="box-shipping">
                              <h1 className="font-bold text-[20px] mb-2">Vận chuyển</h1>
                              <div className="flex  justify-between items-center border rounded-md px-2 py-3">
                                  <div className="flex gap-2 items-center">
                                      <input type="radio" />
                                      <p className="text-[14px]">Miễn phí vận chuyển đơn hàng từ 498k</p>
                                  </div>
                                  <p>Miễn phí</p>
                              </div>
                          </div> */}
                        <div className="box-payment">
                            <h1 className="font-boldx  text-[20px] mb-2 mt-5">Thanh toán</h1>
                            <Radio.Group onChange={onChange} value={value}>
                                {paymentMethodList?.map((item: any, index: any) => {
                                    // const radioId = `paymentMethod_${index}`;
                                    return (
                                        <div
                                            key={index}
                                            className="flex justify-between  min-h-[50px] items-center border w-full rounded-md px-2 py-2 mb-2"
                                        >
                                            <div className="flex gap-2 items-center  w-full cursor-pointer">
                                                <Radio value={item} className="max-w-[400px] w-[300px]">
                                                    {item?.pMethod_description}
                                                </Radio>
                                            </div>
                                            <div className="max-w-[40px] max-h-[50px]">
                                                <img
                                                    className="w-full"
                                                    src={item?.pMethod_image?.url}
                                                    alt="img"
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </Radio.Group>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gray-50 py-3 shadow rounded-md border border-gray-100">
                {products?.map((item: any, index: string) => {
                    return (
                        <div
                            key={index}
                            className="product-list flex items-center  justify-between border-b "
                        >
                            <div className="product-detail flex items-center px-5 py-3  gap-3">
                                <div className="product-img">
                                    <div className="relative  w-[50px] h-[50px] border">
                                        <img
                                            className=" rounded-sm h-full w-full"
                                            src={item?.product_image?.url}
                                            alt="image"
                                        />
                                    </div>
                                    <div className="mt-[-54px] border rounded-full px-[6px] text-[12px] bg-yellow-300 ml-[34px] z-10 absolute">
                                        {item.quantity}
                                    </div>
                                </div>
                                <div className="product-content">
                                    <h3 className="text-[14px]">{item?.product_name}</h3>
                                </div>
                            </div>
                            <div className="product-totalPrice mr-5">
                                <span>
                                    {item?.price &&
                                        item?.price?.toLocaleString("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        })}
                                </span>
                            </div>
                        </div>
                    );
                })}

                <div className="border-b px-5 py-4">
                    {/* <CouponCheckOut
                        setCouponCode={setCouponCode}
                        user={user}
                        totalPrice={totalPrice}
                        couponCode={couponCode}
                        setPriceAppLy={setPriceAppLy}
                        priceAppLy={priceAppLy}
                        selectedProducts={selectedProducts}
                        shippingFee={shippingFee}
                        setCouponIdRes={setCouponIdRes}
                    /> */}
                </div>
                <div>
                    <div className=" flex items-center justify-between border-b py-4 px-5">
                        <h2>Tạm tính</h2>
                        <span>
                            {(totalPrice &&
                                totalPrice?.toLocaleString("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                })) ||
                                0}{" "}
                        </span>
                    </div>
                    <div className=" flex items-center justify-between border-b py-4 px-5">
                        <h2>Tổng tiền phí vận chuyển</h2>
                        <span>
                            {(shippingFee &&
                                shippingFee.toLocaleString("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                })) ||
                                0}{" "}
                        </span>
                    </div>
                    {totalPrice > 100000 && (
                        <div className=" flex items-center justify-between border-b py-4 px-5">
                            <h2>Giảm giá phí vận chuyển</h2>
                            <span>
                                -{" "}
                                {(totalPrice > 100000 &&
                                    shippingFee?.toLocaleString("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    })) ||
                                    0}
                            </span>
                        </div>
                    )}
                    {/* {couponIdRes && (
                        <div className=" flex items-center justify-between border-b py-4 px-5">
                            <h2>Số tiền được áp mã giảm giá</h2>
                            <span>
                                -{" "}
                                {(totalPrice - (priceAppLy - cartCouponPrice))?.toLocaleString(
                                    "vi-VN",
                                    {
                                        style: "currency",
                                        currency: "VND",
                                    }
                                ) || 0}
                            </span>
                        </div>
                    )} */}

                    <div className=" flex items-center justify-between border-b py-4 px-5">
                        <h2>Tổng cộng</h2>
                        <span>
                            {priceAppLy?.toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                            }) || 0}{" "}
                        </span>
                    </div>
                    <div className=" flex items-center border-b  justify-between py-4  px-5">
                        <Link to="">Quay về giỏ hàng</Link>
                        <button className="bg-yellow-400 rounded-sm py-2 hover:bg-yellow-500 transition-all px-3">
                            {isLoadingButton ? (
                                <div>
                                    Đang đặt hàng <Spin />{" "}
                                </div>
                            ) : (
                                "ĐẶT HÀNG"
                            )}
                        </button>
                    </div>
                </div>
            </div>

        </form>
    )
}

export default CheckoutPage