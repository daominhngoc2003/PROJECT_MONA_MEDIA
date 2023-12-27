import { Link, useNavigate } from "react-router-dom";
import { GetUserById, LogoutUser } from "../../api/User";
import "./Header-client.scss"
import { IoMenu } from "react-icons/io5";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { getDecodedAccessToken } from "../../decoder";
import Search from "./components/Search";
import { CartContext } from "../../provider/CartReducer";
import { GetCartByUser } from "../../api/Cart";
import { toast } from "react-toastify";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const token: any = getDecodedAccessToken();
    const { state: carts, dispatch } = useContext(CartContext);
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();
    const cartList = useMemo(() => carts?.carts, [carts])
    const roleName = token?.role_name;

    const logout = () => {
        LogoutUser();
        window.location.reload();
    }
    const menuRef = useRef<any>(null);
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event: any) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetCart = async () => {
            try {
                const { data } = await GetCartByUser(token?._id);
                dispatch({ type: "cart/getCartByUser", payload: data.cart })
            } catch (error) {
                console.log(error);
            }
        }
        fetCart();
    }, [])

    useEffect(() => {
        const getUserDetail = async () => {
            const { data } = await GetUserById(token?._id);
            if (data.success) {
                setUser(data.user)
            }
        }
        getUserDetail();
    }, [])

    const handleClick = async () => {
        if (!user?._id) {
            const loginResult: any = await toast.error("Bạn cần đăng nhập để thực hiện chức năng này")

            if (loginResult.isConfirmed) {
                navigate("/login");
            }
        }
    };
    return (
        <header className="header-wrapper" ref={menuRef}>
            <nav className="navbar">
                <div className="navbar-wrapper">
                    <div className="navbar-logo">
                        <h1>CLEVERFOOD</h1>
                    </div>
                    <ul className={`nav-pc`}>
                        <li><Link to="/">TRANG CHỦ</Link></li>
                        <li><Link to="/about">GIỚI THIỆU</Link></li>
                        <li>
                            <Link to="/products">SẢN PHẨM</Link>
                        </li>
                        <li><Link to="/products">TIN TỨC</Link></li>
                        <li><Link to="/contact">LIÊN HỆ</Link></li>
                    </ul>
                    <ul className={`navbar-menu menu-bar  ${isOpen ? 'menu-transition active bg-white ' : 'menu-transition'} `}>
                        <li><Link to="/">TRANG CHỦ</Link></li>
                        <li><Link to="/about">GIỚI THIỆU</Link></li>
                        <li>
                            <Link to="/products">SẢN PHẨM</Link>
                        </li>
                        <li><Link to="/products">TIN TỨC</Link></li>
                        <li><Link to="/contact">LIÊN HỆ</Link></li>
                    </ul>

                    <div className="navbar-actions">
                        <Search />
                        <div className="account menu-item">
                            {user ? <Link to="#"><img width={20} className="mx-2 w-[25px]" style={{ borderRadius: "100%" }} src={user?.user_avatar?.url} alt="Avata" /></Link> : <Link to="#"><i className="fa-solid fa-user"></i></Link>}
                            {user ? <ul className="account-submenu">
                                {roleName === "Admin" && <li><Link to="admin">Trang quản trị</Link></li>}
                                <li><Link to="account">Tài khoản của tôi</Link></li>
                                <li><Link to="account/bills">Đơn mua</Link></li>
                                <li><Link to="#" onClick={logout}>Đăng xuất</Link></li>
                            </ul> : <ul className="account-submenu">
                                <li><Link to="/signin">Đăng nhập</Link></li>
                                <li><Link to="/signup">Đăng ký</Link></li>
                            </ul>
                            }
                        </div>
                        {/* <div className="cart">
                            <Link to="/cart"><i className="fa-solid fa-cart-shopping"></i></Link>
                        </div> */}
                        <div className="nav-cart cart-menu-item text-[20px] w-[30px]  cursor-pointer relative">

                            <ul className="cart-submenu left-[-270px] lg:left-[-340px]">
                                {user ? (
                                    <div>
                                        <h1 className="text-gray-400 mb-2">Sản phẩm mới thêm</h1>
                                        {cartList && cartList?.products?.length > 0 ? (
                                            cartList?.products?.map((item: any) => {
                                                return (
                                                    <li className="mb-4" key={item?._id}>
                                                        <div>
                                                            <Link
                                                                to={`/products/${item?.product_id?._id}`}
                                                                className="grid grid-cols-[auto,30%] gap-1 px-2 items-center justify-between hover:bg-gray-200 py-3 transition-all duration-300 cursor-help"
                                                            >
                                                                <div className=" flex items-center gap-2">
                                                                    <div className="max-w-[50px] h-[5opx]">
                                                                        <img src={item?.product_image?.url} alt="" />
                                                                    </div>
                                                                    <h1 className="font-bold">{item?.product_name}</h1>
                                                                </div>
                                                                <div >
                                                                    <span className="text-red-500 ">
                                                                        {item?.quantity}
                                                                    </span>
                                                                    <span className="text-red-500 font-medium px-2 text-[12px]">
                                                                        {"X"}
                                                                    </span>
                                                                    <span className="text-red-500">
                                                                        {item?.product_discount === 0 ? item?.product_price : item?.product_discount}
                                                                    </span>
                                                                </div>
                                                            </Link>
                                                        </div>
                                                    </li>
                                                )
                                            })
                                        ) : (
                                            <div className="text-xl font-medium">Giỏ hàng trống</div>
                                        )}
                                        <div className="flex justify-between gap-2 items-center mt-3">
                                            <span className="flex justify-between gap-1 items-center">
                                                <p>Thêm</p>
                                                {cartList?.products?.reduce((i: number, a: any) => {
                                                    return i + a?.quantity;
                                                }, 0) || 0}
                                                <p>  sản phẩm vào giỏ hàng</p>
                                            </span>
                                            <Link
                                                to="/cart"
                                                className="bg-[#ca6f04] text-white px-8 text-[16px] py-2 rounded-sm transition-all hover:bg-yellow-800 duration-300"
                                            >
                                                Giỏ hàng
                                            </Link>
                                        </div>
                                    </div>
                                ) : <div>Bạn cần đăng nhập để có thể sử dụng chức năng này <Link className="text-blue-400" to={'signin'}>Đăng nhập</Link></div>}
                            </ul>

                            <Link to="/" className="" onClick={handleClick}>
                                <div className="icon-cart">
                                    <i className="fa-solid fa-bag-shopping fa-bounce text-gray-600 hover:text-[#ca6f04] transition-all"></i>
                                    <span className="absolute bg-[#ca6f04] right-[-8px] text-white rounded-full px-[5px] text-[10px]">
                                        {(user && cartList) ? cartList?.products?.length || 0 : 0}
                                    </span>
                                </div>
                            </Link>
                        </div>
                        <div className="btn-menu">
                            <p onClick={toggleDropdown}>
                                <IoMenu />
                            </p>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Header