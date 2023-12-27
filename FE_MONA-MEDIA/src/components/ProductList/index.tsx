import { Link, useNavigate } from "react-router-dom"
import { getDecodedAccessToken } from "../../decoder"
import { toast } from "react-toastify"
import { AddToCart } from "../../api/Cart"
import { useContext } from "react"
import { CartContext } from "../../provider/CartReducer"

type IProp = {
    pro: any,
}
const ProductComponents = ({ pro }: IProp) => {
    const token: any = getDecodedAccessToken();
    const navigate = useNavigate();
    const { dispatch: dispatchCart } = useContext(CartContext);
    const onaddToCart = async (pro: any) => {
        if (token) {
            try {
                const formCart = {
                    product_id: pro?._id,
                    quantity: 1,
                    user_id: token?._id
                }
                const { data } = await AddToCart(formCart);
                toast.success(data.message)
                await dispatchCart({ type: "cart/addToCart", payload: data.cart });
                navigate("/cart")

            } catch (error: any) {
                toast.error(error?.response?.data?.message)
            }
        } else {
            toast.error("Bạn chưa đăng nhập")
        }
    }

    const productPercent = ((pro.product_price - pro.product_discount) * 100) / pro.product_price;

    return (
        <div className="relative border border-[#669933] rounded-[20px] group hover:shadow-md transition-all">
            {pro.product_discount !== 0 ?
                <div className="absolute z-30 mt-3 border rounded-full w-[50px] text-center py-2 bg-[#f851a7] text-white">
                    <span className="product-sale">-{productPercent}%</span>
                </div>
                : ''}
            <Link to={`/products/${pro._id}`} className="product-image  rounded-t-[20px] overflow-hidden block h-[250px]">
                <img
                    className="w-full h-full rounded-t-[20px] group-hover:scale-105 transition-all"
                    src={pro?.product_image?.url}
                    alt="" />
            </Link>
            <div className="product-content ">
                <h1 className=" text-center mt-3">
                    <Link to={`/products/${pro._id}`} className="text-[#f751a7] hover:text-[#bf2b77] transition-all text-[25px]">
                        {pro?.product_name?.length > 15 ? pro.product_name.slice(0, 15).concat("...") : pro.product_name}
                    </Link>
                </h1>
                {pro && pro.product_discount !== 0 ? (
                    <div className=" flex items-center  gap-2 px-3 text-center justify-center text-[20px] my-2">

                        <div className="discount  text-[#ff0000]"><span>{Number(pro.product_discount || '').toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span></div>
                        <del className="price text-gray-500"><span>{Number(pro.product_price || '').toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span></del>
                    </div>
                ) : (
                    <div className=" flex items-center  gap-2 px-3 text-center justify-center text-[20px] my-2">
                        <div className="price text-[#ff0000]"><span>{Number(pro.product_price || '').toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span></div>
                    </div>
                )}

            </div>
            <div className="text-center mb-2">
                <button
                    onClick={() => onaddToCart(pro)}
                    className="bg-[#669933] hover:bg-[#497b16] transition-all  text-white px-5 py-2 rounded-[30px]">Mua ngay</button>
            </div>
        </div>
    )
}

export default ProductComponents