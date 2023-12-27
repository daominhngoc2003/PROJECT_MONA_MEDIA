import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useMemo, useState } from "react";
import { getDecodedAccessToken } from "../../../../decoder";
import { Pagination, message } from "antd";
import { AbortBill, GetBillByUser, updateBillStatus } from "../../../../api/Bill";
import { toast } from "react-toastify";
import { BillContext } from "../../../../provider/BillReducer";
import { GetAllDStatus } from "../../../../api/DStatus";
import { AddToCart } from "../../../../api/Cart";
import Reviews from "./Reviews";


const BillListPage = () => {
    const navigate = useNavigate();
    const { state: bills, dispatch } = useContext(BillContext);
    const [DStatus, setDStatus] = useState([]);
    const [filterBill, setFilterBill] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [currentStatus, setCurrentStatus] = useState('all');
    const token: any = getDecodedAccessToken();
    const DStatusList: any = useMemo(() => DStatus, [DStatus]);
    const BillData = useMemo(() => bills.bills, [bills]);
    // const userId = userData?.user?._id;

    // const req = {
    //     userId,
    // }

    useEffect(() => {
        (async () => {
            try {
                const { data } = await GetBillByUser({ user_id: token?._id } as any);
                if (data.success) {
                    dispatch({ type: "bill/getBillByUser", payload: data.bills })
                }
                else {
                    toast.error(data.message)
                }

            } catch (error: any) {
                toast.error(error.response.data.message);
            }
        })()
    }, [])

    const fetDStatus = async () => {
        try {
            const { data } = await GetAllDStatus();
            if (data.success) {
                setDStatus(data.dstatus);
            }
            else {
                toast.error(data.message)
            }

        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }
    useEffect(() => {
        fetDStatus()
    }, [])

    // const Bill = billData?.bills;
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const handlePageChange = (page: any) => {
        setCurrentPage(page);
    };

    const displayedOrders: any = BillData && filterBill?.slice(startIndex, endIndex);

    const onHandleChangeStatus = (status: string) => {
        setCurrentStatus(status);
        if (status === 'all') {
            setFilterBill(BillData);
        } else {
            const filtered = BillData?.filter((item: any) => item.payment_status?._id === status);
            setFilterBill(filtered)
        }
    }

    const [open, setOpen] = useState(false);
    const [reviewBillId, setReviewBillId] = useState(null);
    const openReviewModal = (billId: string | any) => {
        setOpen(true);
        setReviewBillId(billId);
    };

    useEffect(() => {
        if (currentStatus === 'all') {
            setFilterBill(BillData);
        } else {
            const filtered = BillData?.filter((item: any) => item.payment_status?._id === currentStatus);
            setFilterBill(filtered);
        }
        if (searchValue) {
            filterData(searchValue);
        }
    }, [currentStatus, BillData, searchValue])

    const onHandleSearch = (event: any) => {
        const value = event.target.value;
        setSearchValue(value);
        filterData(value);
    };

    const filterData = (value: any) => {
        if (value === '' || !value) {
            setFilterBill(BillData);
        } else {
            const filtered = BillData?.filter((item: any) =>
                item.bill_code.toLowerCase().includes(value)
            );
            setFilterBill(filtered);
        }
    };

    //
    const onHandleUpdateStatus = async (value: any) => {
        try {
            const formData = {
                payment_status: value?.payment_status?._id,
                status: value?.status,
                _id: value?._id,
            };

            const { data } = await updateBillStatus(formData);

            if (data.success) {
                window.location.reload();
                message.success("Cập nhật trạng thái đơn hàng!");
                navigate("/account/bills");
            } else {
                message.error(`${data.data.message}`);
            }
        } catch (error: any) {
            message.error(`${error?.data?.response?.message}`);
        }
    }

    const onHandRemoveBill = async (_id: string) => {
        try {
            const { data }: any = await AbortBill(_id);
            // dispatch({ type: "bill/getBillByUser", payload: data.bills })
            window.location.reload();
            if (data) {
                alert(`${data.message}`)
            }
        } catch (error: any) {
            message.error(error?.data.message)
        }
    };

    const onHandleRepurchase = async (bill: any) => {

        if (bill) {
            bill.products.map(async (item: any) => {
                const dataCart = {
                    user_id: bill?.user_id?._id,
                    quantity: item?.quantity,
                    product_id: item?.product_id,
                };

                if (item.product_quantity === 0) {
                    message.error("Sản phẩm đã hết hàng")
                }
                try {
                    const { data } = await AddToCart(dataCart);
                    if (data.success) {
                        message.success(`${data.message}`);
                        navigate("/cart");
                    } else {
                        message.error(`${data.message}`);
                    }
                } catch (error: any) {
                    message.error(error.response.data.message)
                }
            });
        } else {
            message.error("Đơn hàng không tồn tại")
        }
    }

    return (
        <div>
            <div className="text-sm font-medium text-center bg-white mb-5 text-gray-500 shadow-sm border-gray-200 dark:text-gray-400 dark:border-gray-700">
                <ul className="flex justify-between">
                    <li className="w-full">
                        <Link to="#"
                            onClick={(e) => {
                                e.preventDefault();
                                onHandleChangeStatus('all');
                                setCurrentStatus('all');
                            }}
                            className={` block p-4 hover:bg-gray-50 border-b-2  ${currentStatus === 'all' && "border-red-300 text-red-400 "} border-transparent rounded-t-lg hover:text-gray-600  dark:hover:text-gray-300`}>
                            Tất cả</Link>
                    </li>
                    {DStatusList?.map((item: any, index: string) => {
                        return (
                            <li className="w-full" key={index}>
                                <Link
                                    to={`/account/bills`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onHandleChangeStatus(item?._id);
                                    }}
                                    className={`block   ${currentStatus === item?._id && "border-red-300 text-red-400 "} p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:text-gray-300`}>
                                    {item.pStatus_description}</Link>
                            </li>
                        )
                    })}
                </ul>
            </div>
            <div className="box">
                <form
                    className="box-search flex items-center space-x-2 mb-3 bg-[#eaeaea] w-full py-3 ">
                    <i className="fa-solid fa-magnifying-glass  pl-4"></i>
                    <input type="text" onChange={() => onHandleSearch(event)} className="border-none outline-none w-full  bg-[#eaeaea]" placeholder="Tìm kiếm" />
                </form>
                <div>
                    <div>
                        {(displayedOrders?.length < 1 || displayedOrders === undefined) ? (<div className="w-full flex items-center justify-center h-[200px] bg-gray-100">Bạn chưa mua đơn hàng nào</div>)
                            : (
                                <div>
                                    {displayedOrders?.map((item: any, index: string) => {

                                        return (
                                            <div key={index} className="mb-5 shadow-sm">
                                                <div className="bg-white p-5 border border-gray-50">
                                                    <div className="flex md:text-[14px] text-[12px] items-center justify-between">
                                                        <div className="flex items-center gap-2 ">
                                                            <div className="font-bold px-2  bg-red-600 text-white py-1">Store</div>
                                                            <div className="border border-gray-100  px-2 py-1">Mã đơn hàng: {item?.bill_code}</div>
                                                        </div>
                                                        <div className="flex items-center space-x-3">
                                                            <p className="text-green-700">{item?.status === "Unpaid" ? "Chưa thanh toán" : "Đã thanh toán"}</p> <p>|</p>
                                                            <p className="text-red-600">{item?.payment_status?.pStatus_description}</p>
                                                        </div>
                                                    </div>
                                                    <hr className="mt-3" />
                                                    <div>
                                                        {item?.products?.map((pro: any, index: string) => {
                                                            return (
                                                                <Link
                                                                    to={`/account/bills/${item?._id}`}
                                                                    key={index}
                                                                    className="cart-List hover:bg-gray-50 transition-all grid md:grid-cols-[800px,auto] items-center"
                                                                >
                                                                    <div className="py-3 flex gap-2">
                                                                        <div className="max-w-[100px] border w-[80px] h-[80px]">
                                                                            <img
                                                                                src={
                                                                                    pro
                                                                                        ?.product_image
                                                                                        ?.url
                                                                                }
                                                                                className="w-full h-full"
                                                                                alt="image"
                                                                            />
                                                                        </div>
                                                                        <div className="flex flex-col gap-2">
                                                                            <div>
                                                                                <h1 className="hover:text-red-400 transition-all">
                                                                                    <Link
                                                                                        to={`/products/${pro?.product_id}`}
                                                                                    >
                                                                                        {
                                                                                            pro?.product_name
                                                                                        }
                                                                                    </Link>
                                                                                </h1>
                                                                            </div>

                                                                            <div className="flex">
                                                                                <p className="flex items-center">
                                                                                    <p>x</p>{" "}
                                                                                    <span className=" font-medium">
                                                                                        {
                                                                                            pro?.quantity
                                                                                        }
                                                                                    </span>
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {pro?.product_discount >
                                                                        0 ? (
                                                                        <div className="flex items-center text-[15px] gap-2">
                                                                            <span>
                                                                                <del>
                                                                                    {pro?.product_price?.toLocaleString(
                                                                                        "vi-VN",
                                                                                        {
                                                                                            style:
                                                                                                "currency",
                                                                                            currency:
                                                                                                "VND",
                                                                                        }
                                                                                    )}{" "}
                                                                                </del>
                                                                            </span>
                                                                            <span className="text-red-500">
                                                                                {pro?.product_discount?.toLocaleString(
                                                                                    "vi-VN",
                                                                                    {
                                                                                        style:
                                                                                            "currency",
                                                                                        currency:
                                                                                            "VND",
                                                                                    }
                                                                                )}{" "}
                                                                            </span>
                                                                        </div>
                                                                    ) : (
                                                                        <span>
                                                                            {pro?.product_price?.toLocaleString(
                                                                                "vi-VN",
                                                                                {
                                                                                    style:
                                                                                        "currency",
                                                                                    currency:
                                                                                        "VND",
                                                                                }
                                                                            )}{" "}
                                                                        </span>
                                                                    )}
                                                                </Link>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                                <div className="bg-[#fffefb] border border-gray-50 py-4 px-4">
                                                    <div className="flex justify-between items-center">
                                                        <div></div>
                                                        <span className="flex gap-3 items-center">Thành tiền: <p className="text-red-500 text-[20px]">{item?.bill_totalOrder?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p></span>
                                                    </div>
                                                    <div>
                                                        <div className="flex gap-2  mb-5">
                                                            {(item?.payment_status?.pStatus_name === "Delivered" || item?.payment_status?.pStatus_name === "Reviews") ? (
                                                                <button
                                                                    onClick={() => onHandleRepurchase(item)}
                                                                    className="bg-red-500 text-center text-white hover:text-white max-w-[140px] border-gray-300 hover:bg-red-600 transition-all rounded-md w-full  py-2">
                                                                    Mua lại</button>
                                                            ) : ''}
                                                            {item?.payment_status?.pStatus_name === "Delivering" && (
                                                                <button
                                                                    className="  px-5 max-w-[200px] bg-red-500 hover:bg-red-600 text-white border-2 border-green-100 hover:border-green-300  transition-all rounded-md w-full  py-2"
                                                                    onClick={() => onHandleUpdateStatus(item)}>
                                                                    Đã nhận được hàng
                                                                </button>
                                                            )}
                                                            {(item?.payment_status?.pStatus_name !== "Delivering" && item?.payment_status?.pStatus_name !== "Delivered" && item?.payment_status?.pStatus_name !== "Reviews" && item?.payment_status?.pStatus_name !== "Abort") ? <button
                                                                onClick={() => onHandRemoveBill(item?._id)}
                                                                className="bg-red-500 text-white max-w-[140px] border-2 border-gray-100 hover:border-green-300  transition-all rounded-md w-full  py-2"
                                                            >Hủy</button> : ''}
                                                            {(item?.payment_status?.pStatus_name === "Delivered" && item?.isReview === false) ? (
                                                                <div>
                                                                    <button
                                                                        className="  px-5 max-w-[200px] bg-yellow-400 hover:bg-yellow-600 text-white border-2 border-green-100 hover:border-green-300  transition-all rounded-md w-full  py-2"
                                                                        onClick={() => openReviewModal(item?._id)}>
                                                                        Đánh giá
                                                                    </button>
                                                                    <Reviews open={open} setOpen={setOpen} billId={reviewBillId} />
                                                                </div>
                                                            ) : ''}
                                                            {/* {item?.status === "Unpaid" && (
                                                                <div>
                                                                    <p
                                                                        className=" cursor-pointer px-5 max-w-[200px] text-black bg-white border-2 border-green-100 hover:border-green-300  transition-all rounded-md w-full  py-2"
                                                                        onClick={() => onHandlePayment(item)}>
                                                                        Thanh toán
                                                                    </p>
                                                                </div>
                                                            )} */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        {(displayedOrders?.length > 1 || displayedOrders !== undefined) && (
                            <div className="text-center">
                                <Pagination
                                    current={currentPage}
                                    total={filterBill?.length}
                                    pageSize={itemsPerPage}
                                    onChange={handlePageChange}
                                />
                            </div>
                        )}

                    </div>
                </div>
            </div >
        </div >
    );
};

export default BillListPage;
