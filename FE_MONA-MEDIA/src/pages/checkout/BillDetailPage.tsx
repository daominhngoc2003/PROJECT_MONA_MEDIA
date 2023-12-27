import { useContext, useEffect } from "react";
import "./BillDetaill.scss"
import { BillContext } from "../../provider/BillReducer";
import { AbortBill, GetBillByUser } from "../../api/Bill";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
const BillDetailPage = () => {
    const { state: bills, dispatch } = useContext(BillContext);
    const token = JSON.parse(localStorage.getItem("user") || '{}');
    const user = token.user;

    useEffect(() => {
        const fetCart = async () => {
            try {
                const { data } = await GetBillByUser(user._id);
                dispatch({ type: "bill/getBillByUser", payload: data.bills })
            } catch (error) {
                console.log(error);
            }
        }
        fetCart();
    }, [])
    const onHandleDelete = async (_id: string) => {
        const confirm = window.confirm("Bạn có chắc muốn xóa");
        if (confirm) {
            const { data } = await AbortBill(_id);
            toast.success(data.message)
            dispatch({ type: "bill/deleteBill", payload: data.bill._id })
        }
    };
    return (
        <div className="container">
            <section className="grid grid-cols-3">

                <div className="userName-account">
                    <Link to="#"><img width={20} style={{ borderRadius: "100%" }} src={user?.user_avatar} alt="Avata" /></Link>
                    <div className="userName-account ">
                        <h1> {user.user_fullName}</h1>
                    </div>
                </div>
                <div className="col-1">
                    <h1>Tất cả đơn hàng</h1>
                    <div className="bill-wrapper">
                        <div className="box-header">a</div>
                        <div className="box-content">
                            {bills?.bills.map((bill: any, index: string) => {
                                return (
                                    <div key={index}>
                                        {bill?.products.map((pro: any, index: string) => {
                                            return (
                                                <div key={index}>
                                                    <div className="flex">
                                                        <div className="col-name">
                                                            <div className="cart-image">
                                                                <img src={pro?.productId?.product_images.url}
                                                                    alt="image" />
                                                            </div>
                                                            <div className="cart-name">
                                                                <Link to="#">{pro?.productId?.product_name}</Link>
                                                            </div>
                                                        </div>
                                                        <div className="col-total">{pro?.price} đ</div>
                                                    </div>
                                                    <div className="box-footer ">
                                                        {/* <div className="bill-remove">
                                                            <button onClick={() => onHandleDelete(pro._id)}>Hủy đơn hàng</button>
                                                        </div> */}
                                                        <div className="bill-review">
                                                            <Link to={`/products/${pro?.productId._id}`}>Đánh giá</Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                        <div className="bill-box-footer ">
                                            <div className="bill-remove">
                                                <button onClick={() => onHandleDelete(bill._id)}>Hủy đơn hàng</button>
                                            </div>
                                        </div>
                                    </div>

                                )
                            })}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default BillDetailPage