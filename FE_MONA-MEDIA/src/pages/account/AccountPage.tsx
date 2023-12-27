import { Link, Outlet, useLocation } from "react-router-dom";
import { getDecodedAccessToken } from "../../decoder";
import { RiBillFill } from "react-icons/ri";
import { MdOutlineStarRate } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { RiAccountPinBoxFill } from "react-icons/ri";
import { useContext, useEffect, useMemo, useState } from "react";
import { UserContext } from "../../provider/UserProvider";
import { GetUserById } from "../../api/User";

const AccountPage = () => {

    const token: any = getDecodedAccessToken();
    const { state: UserData, dispatch } = useContext(UserContext);

    const user = useMemo(() => UserData?.users, [UserData]);

    const location = useLocation();
    const [currentPage, setCurrentPage] = useState("");

    useEffect(() => {
        const dataUser = async () => {
            const { data } = await GetUserById(token?._id);
            if (data.success) {
                dispatch({ type: "user/getUserById", payload: data.user })
                // setUser(data.user);
            }
        }
        dataUser()
    }, [])

    useEffect(() => {
        // Lấy path của trang hiện tại từ location
        const path = location.pathname;

        // Cập nhật trạng thái của trang hiện tại
        setCurrentPage(path);
    }, [location]);

    return (
        <div className="px-2 mx-auto mt-10 max-w-[1200px] md:px-5">
            <div className="grid gap-4 md:grid-cols-5">
                <div className="col-span-1">
                    <div className="py-2 mb-5   rounded-md product_category">
                        <ul className="grid grid-cols-1 md:grid-cols-1 gap-3 w-[350px] md:w-[200px] md:ml-3 pt-3">
                            <Link
                                to="dashboard"
                                className="cursor-pointer flex items-center gap-3 md:text-[15px]  px-3 py-1 duration-300 transition-all "
                            >
                                <div className=" w-[40px] h-[40px]">
                                    <img
                                        src={user?.user_avatar?.url}
                                        className="w-full h-full rounded-full"
                                        alt="avatar"
                                    />
                                </div>
                                <h1>{user?.user_username}</h1>
                            </Link>
                            <Link
                                to="info"
                                className={`  ${currentPage === "/account/info" ? "text-[#2c7be5]" : "hover:text-blue-600"}  cursor-pointer  md:text-[15px]  px-3 py-1 duration-300 flex  items-center gap-2 transition-all `}
                            >
                                <RiAccountPinBoxFill />
                                Thông tin tài khoản
                            </Link>
                            <Link
                                to="change-password-new"
                                className={`  ${currentPage === "/account/change-password-new" ? "text-[#2c7be5]" : "hover:text-blue-600"} cursor-pointer  md:text-[15px]  px-3 py-1 duration-300 flex  items-center gap-2 transition-all `}
                            >
                                <RiLockPasswordFill />
                                Đổi mật khẩu
                            </Link>
                            {/* <Link
                  to="forget-password"
                      className={`cursor-pointer  md:text-[15px]  px-3 py-1 duration-300 flex  items-center gap-2 transition-all `}
                >
                  <i className="fa-regular fa-user hover:text-[#ca6f04] transition-all mr-2"></i>
                  Quên mật khẩu
                </Link> */}
                            {/* <Link
                                to="favorites"
                                className={` ${currentPage === "/account/favorites" ? "text-[#2c7be5]" : "hover:text-blue-600"} cursor-pointer  md:text-[15px]  px-3 py-1 duration-300 flex  items-center gap-2 transition-all `}
                            >
                                <FaHeart />
                                Yêu thích
                            </Link> */}
                            <Link
                                to="bills"
                                className={` ${currentPage === "/account/bills" ? "text-[#2c7be5]" : "hover:text-blue-600"} cursor-pointer  md:text-[15px]  px-3 py-1 duration-300 flex  items-center gap-2 transition-all `}
                            >
                                <RiBillFill />
                                Đơn hàng
                            </Link>
                            {/* <Link
                                to="vouchers"
                                className={` ${currentPage === "/account/vouchers" ? "text-[#2c7be5]" : "hover:text-blue-600"} cursor-pointer flex items-center gap-2 md:text-[15px]   px-3 py-1 duration-300 transition-all `}
                            >
                                <RiCouponFill />
                                Kho voucher
                            </Link> */}
                            <Link
                                to="reviews"
                                className={` ${currentPage === "/account/reviews" ? "text-[#2c7be5]" : "hover:text-blue-600"} cursor-pointer  md:text-[15px]  px-3 py-1 duration-300 flex  items-center gap-2 transition-all `}
                            >
                                <MdOutlineStarRate />
                                Đánh giá
                            </Link>
                        </ul>
                    </div>
                </div>
                <div className="col-span-4 bg-gray-50 shadow-md p-4 mb-10">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AccountPage;
