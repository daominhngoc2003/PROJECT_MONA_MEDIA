import { Link } from "react-router-dom";
import "./ProductPage.scss"
import { useEffect, useContext, useState, useMemo, useRef } from "react";
import { toast } from 'react-toastify';
import { ProductContext } from "../../provider/ProductProvider";
import { ICategory } from "../../types/Category";
import { IProduct } from "../../types/Product";
import ProductComponents from "../../components/ProductList";
import { Pagination } from 'antd';
import { getProductClient } from "../../api/Product";
import { getCategoriesClient } from "../../api/Category";

const ProductPage = () => {
    const [categories, setCategory] = useState<ICategory[]>([])
    const { state: products, dispatch } = useContext(ProductContext);
    const [iserr, setIsErr] = useState(false);
    const [currentPages, setCurrentPage] = useState(1);
    const [_keywords] = useState('');
    const [categorySelect, setCatgorySelect] = useState('');
    const prevCategorySelect = useRef(categorySelect);

    const dataProductReq = {
        _limit: 100,
        category_id: categorySelect
    }
    const dataCateReq = {
        _limit: 100
    }

    const productList = useMemo(() => products?.products || [], [products]);

    useEffect(() => {
        if (prevCategorySelect.current !== categorySelect) {
            prevCategorySelect.current = categorySelect;

            const fetchData = async () => {
                setIsErr(false);
                try {
                    const { data } = await getProductClient(dataProductReq);

                    if (data.success) {
                        dispatch({ type: "product/getall", payload: data.products });
                    } else {
                        toast.error(data.message);
                    }
                } catch (error: any) {
                    console.log(error);
                    setIsErr(true);
                    toast.error(error?.response?.data.message);
                }
            };

            fetchData();
        }
    }, [categorySelect]);

    // XỬ LÝ KHI CHUYỂN TRANG
    const onHandlePageChange = (page: number) => {
        setCurrentPage(page);
    }

    //=====================================CATEGORY===============================
    // LẤY TẤT CẢ DỮ LIỆU danh mục
    useEffect(() => {
        (async () => {
            try {
                const { data } = await getCategoriesClient(dataCateReq);
                if (data) {
                    setCategory(data.categories)
                }
                else {
                    toast.error(data.error.response.data.message)
                }

            } catch (error: any) {
                toast.error(error.response.data.message);
            }
        })()
    }, [])

    const getProductByCategory = async (categoryId: string) => {
        setCatgorySelect(categoryId);
    }
    return (
        <div>
            {/* <!-- PRODUCT --> */}
            <section className="product-section">
                <div className="product-wrapper">
                    <div className="product-header-main">
                        <div className="product-left">
                            <Link to="/">TRANG CHỦ</Link>
                            <p>/</p>
                            <h1>CỬA HÀNG</h1>
                        </div>
                        <div className="product-right">
                            <p>Hiển thị 1–12 trong 16 kết quả</p>
                            <select name="" id="">
                                <option value="">Thứ tự mặc định</option>
                                <option value="">1</option>
                                <option value="">1</option>
                            </select>
                        </div>
                    </div>

                    {/* <!-- PRODUCT-LIST --> */}
                    <div className="product-list">
                        <div className="product-left">
                            <div className="category-box">
                                <div className="category-header">
                                    <h1>DANH MỤC SẢN PHẨM</h1>
                                </div>
                                <ul className="category-content">
                                    {categories?.map((cate, index) => {
                                        return (
                                            <li className="transition-all"
                                                onClick={() => getProductByCategory(cate._id as string)}
                                                key={index}><Link to="#" >{cate.category_name}</Link></li>
                                        )
                                    })}
                                </ul>
                            </div>
                            {/* <div className="filter-price-box">
                                <div className="filter-header">
                                    <h1>LỌC THEO GIÁ</h1>
                                </div>
                                <div className="filter-content">
                                    <input type="range" />
                                </div>
                            </div> */}
                            {/* <div className="product-box">
                                <div className="product-header">
                                    <h1>SẢN PHẨM</h1>
                                </div>
                                <div className="product-content">
                                    <ul>
                                        {productList?.map((pro: any, index: string) => {
                                            return (
                                                <li key={index}>
                                                    <img src={pro?.product_images?.url}
                                                        alt="" />
                                                    <div className="product-title">
                                                        <Link to={`/products/${pro._id}`} >{pro?.product_name?.length > 15 ? pro.product_name.slice(0, 15).concat("...") : pro.product_name}</Link> <br />
                                                        <span className="price">{Number(pro.product_price || '').toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                                                    </div>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            </div> */}
                        </div>
                        <div className="w-full">
                            {/* <div className="product-grid">
                                {productList?.map((pro: IProduct, index: string) => {
                                    const originalPrice = pro.product_price / (1 - pro.product_discount / 100);
                                    return (
                                        <div key={index} className="product-col">
                                            <ProductComponents originalPrice={originalPrice} pro={pro} />
                                        </div>
                                    )
                                })}
                            </div> */}
                            <div className="grid grid-cols-3 gap-4">
                                {(productList?.length < 1 || iserr) ? '' : (
                                    productList?.map((pro: IProduct, index: string) => {
                                        return (
                                            <div key={index} className="product-col">
                                                <ProductComponents pro={pro} />
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                            <div className="text-center mt-4">
                                <Pagination current={currentPages} total={5} onChange={onHandlePageChange} />
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    )
}

export default ProductPage