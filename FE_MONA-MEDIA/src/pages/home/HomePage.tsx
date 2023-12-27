// import "./HomePage.scss"
import { useEffect, useContext, useState, useCallback, useMemo } from "react";
import { toast } from 'react-toastify';
import { ProductContext } from "../../provider/ProductProvider";
import { getProductClient } from "../../api/Product";
import { IProduct } from "../../types/Product";
import ProductComponents from "../../components/ProductList";
import Banner from "./components/Banner";
import Category from "./components/Category";

const HomePage = () => {
    const { state: products, dispatch } = useContext(ProductContext);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const productList = useMemo(() => products?.products || [], [products]);
    const dataReq: any = { _limit: 100 }

    useEffect(() => {
        (async () => {
            try {
                const { data } = await getProductClient(dataReq);
                if (data.success) {
                    dispatch({ type: "product/getall", payload: data.products })
                }
                else {
                    toast.error(data)
                }
            } catch (error: any) {
                console.log(error);

                toast.error(error?.response?.data.message);
            }
        })()
    }, [dispatch])

    // useEffect(() => {
    //     // Lắng nghe sự kiện cuộn
    //     const handleScroll = () => {
    //         if (window.scrollY > 100) { // Khi cuộn xuống dưới 200px, hiển thị nút
    //             setShowScrollButton(true);
    //         } else {
    //             setShowScrollButton(false);
    //         }
    //     };

    //     // Đăng ký sự kiện lắng nghe cuộn
    //     window.addEventListener("scroll", handleScroll);

    //     // Hủy đăng ký sự kiện khi component unmounts
    //     return () => {
    //         window.removeEventListener("scroll", handleScroll);
    //     };
    // }, []);
    // Inside the component
    const handleScroll = useCallback(() => {
        if (window.scrollY > 100) {
            setShowScrollButton(true);
        } else {
            setShowScrollButton(false);
        }
    }, []);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [handleScroll]);



    const handleScrollToTop = () => {
        const scrollToTop = () => {
            if (window.scrollY !== 0) {
                window.scrollBy(0, -60);
                requestAnimationFrame(scrollToTop);
            }
        };
        scrollToTop();
    };

    return (
        <div>
            <div className="">
                {/* <!-- SLIDER --> */}
                <section className="slider-section  w-[1510px] mx-auto bg-[#a0711b]">
                    <Banner />
                </section>
                <section className="feature-category-section relative min-h-[600px] max-w-[1200px] mx-auto">
                    <Category />
                </section>
                <section className="feature-product-section">
                    <div className="feature-product-wrapper max-w-[1200px] mx-auto">
                        <div className="product-title text-[35px] font-medium">
                            <h1>Sản phẩm nổi bật</h1>
                        </div>
                        {/* <ul className="category-list w-[300px] mx-auto flex gap-2 items-center mb-4 justify-center text-[#666] uppercase  text-[20px]">
                            <li><Link to="" className="hover:text-gray-700 transition-all">MỚI NHẤT</Link></li>
                            <li><Link to="">GIẢM GIÁ</Link></li>
                            <li><Link to="">BÁN CHẠY</Link></li>
                        </ul> */}
                        <div className="max-w-[1200px] mt-3">
                            <div className="grid grid-cols-4 gap-6">
                                {productList?.length > 0 ? productList?.map((pro: IProduct, index: string) => {
                                    return (
                                        <div key={index} className="product-col">
                                            <ProductComponents pro={pro} />
                                        </div>
                                    )
                                }) : ''}
                            </div>
                            {productList?.length > 10 && (
                                <div className="text-center mt-5">
                                    <button
                                        className="border hover:bg-[#86ba09] hover:text-white transition-all px-3 py-2 rounded-[20px] text-[#86ba09]  border-[#86ba09]"
                                    >Xem thêm</button>
                                </div>
                            )}

                        </div>
                    </div>
                </section>
                {/* <section className="banner-section">
                    <div className="banner-wrapper">
                        <h1>Khuyến Mãi Trong Tuần</h1>
                        <p className="banner-content">Cơ hội để gia đình bạn sở hữu những sản phẩm ưu đãi</p>
                        <div className="banner-time">
                            <div className="hour">
                                <p>0</p>
                                <p>GIỜ</p>
                            </div>
                            <div className="minute">
                                <p>0</p>
                                <p>PHÚT</p>
                            </div>
                            <div className="second">
                                <p>0</p>
                                <p>GIÂY</p>
                            </div>
                        </div>
                    </div>
                </section> */}
                <section className="slider-section-footer max-w-[1200px] mx-auto">
                    <div className="slider-wrapper-footer  flex items-center  my-10">
                        <div>
                            <img src="https://res.cloudinary.com/djlylbhrb/image/upload/v1691865224/project_fruit/brand5_tonf5p.png" alt="" />
                        </div>
                        <div>
                            <img src="https://res.cloudinary.com/djlylbhrb/image/upload/v1691865224/project_fruit/brand1-1_vcta6d.png" alt="" />
                        </div>
                        <div>
                            <img src="https://res.cloudinary.com/djlylbhrb/image/upload/v1691865224/project_fruit/brand2-1_fdepj3.png" alt="" />
                        </div>
                        <div>
                            <img src="https://res.cloudinary.com/djlylbhrb/image/upload/v1691865224/project_fruit/brand1_twnhnh.png" alt="" />
                        </div>
                        <div>
                            <img src="https://res.cloudinary.com/djlylbhrb/image/upload/v1691865224/project_fruit/brand3_tuzwtz.png" alt="" />
                        </div>
                        <div>
                            <img src="https://res.cloudinary.com/djlylbhrb/image/upload/v1691865224/project_fruit/brand2_jlt1s5.png" alt="" />
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
                            <input type="text" placeholder="Email..." name="a" />
                            <button type="submit">ĐĂNG KÝ</button>
                        </form>
                    </div>
                </section>
                <button
                    id="scrollToTopButton"
                    onClick={handleScrollToTop}
                    className={`scroll-button ${showScrollButton ? 'visible' : 'hidden'}`}
                >
                    ↑
                </button>

            </div>
        </div>
    )
}

export default HomePage