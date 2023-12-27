import { Link } from "react-router-dom";
import "./Footer-client.scss"
const Footer = () => {
    return (
        <div>
            <footer className="footer-section">
                <div className="footer-wraper grid grid-cols-4">
                    <div className="col footer-contact">
                        <div className="footer-logo">
                            <img width="200px"
                                src="http://mauweb.monamedia.net/cleverfood/wp-content/uploads/2019/05/logo-new.png" alt="" />
                        </div>
                        <div className="footer-content">
                            <div className="footer-address"><i className="fa-solid fa-location-dot"></i>Ngõ 3 Phú Kiều , Phường Phúc
                                Diễn, Quận Bắc Từ Liêm, Hà Nội</div>
                            <div className="footer-phone"><i className="fa-solid fa-phone"></i>0869827432</div>
                            <div className="footer-email"><i className="fa-solid fa-envelopes-bulk"></i>ngocdm22052003@gmail.com
                            </div>
                            <div className="footer-facebook"><i className="fa-brands fa-facebook"></i>Đào Minh Ngọc</div>
                        </div>
                    </div>
                    <div className="col footer-menu">
                        <div className="footer-menu-title">
                            <h1>MENU</h1>
                        </div>
                        <ul>
                            <li><Link to="">Trang chủ</Link></li>
                            <li><Link to="">Giới thiệu</Link></li>
                            <li><Link to="">Cửa hàng</Link></li>
                            <li><Link to="">Kiến thức</Link></li>
                            <li><Link to="">Liên hệ</Link></li>
                        </ul>
                    </div>
                    <div className="col footer-products">
                        <div className="footer-menu-product">
                            <h1>SẢN PHẨM</h1>
                        </div>
                        <ul>
                            <li><Link to="">Rau củ</Link></li>
                            <li><Link to="">Trái cây</Link></li>
                            <li><Link to="">Đồ uống</Link></li>
                            <li><Link to="">Đồ khô</Link></li>
                        </ul>
                    </div>
                    <div className="col">
                        <div className="footer-menu-end">
                            <h1>INSTAGRAM</h1>
                        </div>
                        <div className="">
                            Instagram has returned invalid data.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Footer