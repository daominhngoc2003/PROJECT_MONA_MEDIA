import { Tabs } from 'antd';
import { useEffect, useState, useContext, useMemo } from "react";

// import "./Product-detail.scss"
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ProductContext } from '../../provider/ProductProvider';
// import { ICategory } from '../../types/Category';
import { getProductById } from '../../api/Product';
import { CartContext } from '../../provider/CartReducer';
import { AddToCart } from '../../api/Cart';
import { toast } from 'react-toastify';
import { getDecodedAccessToken } from '../../decoder';

const ProductDetail = () => {
    const [activeTab, setActiveTab] = useState('description');
    const { state: products, dispatch } = useContext(ProductContext);
    // const [categories] = useState<ICategory[]>([]);
    const { dispatch: dispatchCart } = useContext(CartContext);
    const product = useMemo(() => products.products, [products]);

    const token: any = getDecodedAccessToken();
    const _id = token?._id;
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    const navigate = useNavigate();
    // LẤY RA ID
    const { slug } = useParams<{ slug: string }>();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await getProductById(slug as string);
                if (data) {
                    dispatch({ type: "product/getDetail", payload: data.product })
                }
            } catch (error: any) {
                console.log(error);
            }
        }
        fetchProduct();
    }, [slug])

    // Input
    const [count, setCount] = useState(1);
    const handleIncrement = () => {
        setCount(count => count + 1);
    };
    const handleDecrement = () => {
        if (count <= 0) return;
        setCount(count => count - 1);
    };

    const onaddToCart = async () => {
        if (token) {
            try {
                const formCart = {
                    product_id: slug,
                    quantity: count,
                    user_id: _id
                }
                const { data } = await AddToCart(formCart);
                toast.success(data.message)
                await dispatchCart({ type: "cart/addToCart", payload: data.cart });
                navigate("/cart")

            } catch (error: any) {
                console.log(error);
            }
        } else {
            toast.error("Bạn chưa đăng nhập")
        }
    }


    const handleTabChange = (key: any) => {
        setActiveTab(key);
    };

    return (
        <div>
            <section className="">
                <div className="w-[1200px] mx-auto">
                    <div className=" grid grid-cols-[50%,50%]">
                        <div className=" max-w-[500px] max-h-[500px] relative shadow mx-auto border">
                            <Link to="#" className='w-full h-full'>
                                <img src={product?.product_image?.url}
                                    alt="" />
                            </Link>
                        </div>
                        <div className="product-content">

                            <div className="product-name">
                                <h1 className='text-[#f751a7] text-[30px]'>{product?.product_name}</h1>
                                <div className='flex items-center w-[250px] flex items-center gap-2'>
                                    <div className="product-view">
                                        <p>{product?.product_view} lượt xem</p>
                                    </div>
                                    <div className="product-view">
                                        <p> {product?.sold_quantity} lượt bán</p>
                                    </div>
                                    <div className="product-Evaluate">
                                        <p><i className="fa-solid fa-star"></i>10 </p>
                                    </div>
                                </div>
                            </div>
                            {product?.product_discount == 0 ? (
                                <div className="product-price my-5">
                                    <span className="price  text-[#ff0000]">{Number(product?.product_price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                                </div>
                            ) : (
                                <div className="product-price my-5">
                                    <span className="price">{Number(product?.product_price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                                    <span className="discount  text-[#ff0000]">{Number(product?.product_discount || '').toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                                </div>
                            )}

                            <div className="content my-5   gap-2">
                                <p dangerouslySetInnerHTML={{ __html: product?.product_description_short }}></p>
                            </div>
                            <div className="show-category">
                                <div className="category-name">
                                    {/* {categories.map((cate, index) => {
                                        const cateName = categories.find(cate => cate._id === product?.categoryId)
                                        return (
                                            <p key={index}>{cateName?.category_name}</p>
                                        )
                                    })} */}
                                </div>
                            </div>
                            <div className='flex items-center w-[300px]'>
                                <div className=" flex items-center text-center cursor-pointer">
                                    <p
                                        onClick={handleDecrement}
                                        className="px-[15px] hover:shadow py-1 text-[#181819] text-xl border border-gray-300  rounded-s"
                                    >
                                        -
                                    </p>
                                    <input
                                        type="text"
                                        value={count}
                                        name="quantity"
                                        // onChange={e => updateQuantity(e.target.value)}
                                        id=""
                                        className="inline-block outline-none w-10 h-[38px] text-center border border-t-gray-300  text-[#171718] text-xl "
                                    />

                                    <p
                                        onClick={handleIncrement}
                                        className="px-[12px] py-1 hover:shadow  border border-gray-300 rounded-r text-[#111112] text-xl"
                                    >
                                        +
                                    </p>
                                </div>
                                <div>
                                    <button
                                        onClick={onaddToCart}
                                        className='bg-[#669933] hover:bg-[#497b16] transition-all  text-white px-5 py-2 rounded-[30px]'>
                                        THÊM VÀO GIỎ</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='my-10'>
                        <Tabs activeKey={activeTab} onChange={handleTabChange}>
                            <Tabs.TabPane tab="MÔ TẢ" key="description">
                                <div className="tab-content" id="descriptionContent">
                                    <div className="product-box">
                                        <div className="product-title">
                                            <h3 className="text-xl text-red font-medium">
                                                Chi tiết sản phẩm
                                            </h3>
                                        </div>
                                        <div className="product-content">
                                            <p>{product?.product_description_long}</p>
                                        </div>
                                    </div>
                                </div>
                            </Tabs.TabPane>
                            {/* reviews */}
                            <Tabs.TabPane tab="ĐÁNH GIÁ" key="evaluate">
                                {/* <Reviews idProduct={id} /> */}
                            </Tabs.TabPane>
                            {/* <Tabs.TabPane tab="BÌNH LUẬN" key="comment">
            <Comment idProduct={id} />
          </Tabs.TabPane> */}
                        </Tabs>
                    </div>
                </div>

            </section >
            <section className="relate-products w-[1200px] mx-auto">
                <div className="product-wrapper">
                    <h1 className="product-title text-[20px]">SẢN PHẨM TƯƠNG TỰ</h1>
                    <div className="product-list">
                        {products?.products?.docs?.map((pro: any, index: string) => {
                            return (
                                <li key={index}>
                                    <img src={pro?.product_image?.url}
                                        alt="" />
                                    <div className="product-title">
                                        <Link to={`/products/${pro.slug}`}>{pro?.product_name?.length > 15 ? pro.product_name.slice(0, 15).concat("...") : pro.product_name}</Link> <br />
                                        <span className="price">{Number(pro.product_price || '').toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                                    </div>
                                </li>
                            )
                        })}
                    </div>
                </div>
            </section>

            <section className="contact-section">
                <div className="contact-wrapper">
                    <div className="contact-title">
                        <h1>Đăng ký để nhận cập nhật</h1>
                    </div>
                    <div className="contact-content">
                        <p>Để lại email để không bỏ lỡ bất kì ưu đãi nào</p>
                    </div>
                    <form action="" className="contact-form">
                        <input type="text" placeholder="Email..." />
                        <button type="submit">ĐĂNG KÝ</button>
                    </form>
                </div>
            </section>
        </div >
    )
}

export default ProductDetail