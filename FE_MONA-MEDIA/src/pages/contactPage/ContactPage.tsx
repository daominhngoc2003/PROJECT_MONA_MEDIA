import { Link } from "react-router-dom";
import "./ContactPage.scss"
const ContactPage = () => {
    return (
        <div>
            <section className="banner-section">
                <div className="banner-wrapper">
                    <h1>LIÊN HỆ</h1>
                    <div className="banner-content">
                        <Link to="">TRANG CHỦ</Link>/
                        <Link to={""}>LIÊN HỆ</Link>
                    </div>
                </div>
            </section>
            {/* <!-- CONTACT --> */}
            <section className="contact-section-main">
                <div className="contact-wrapper-main">
                    {/* <!-- MAP --> */}
                    <div>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.737561142996!2d105.7460974785345!3d21.04318433061325!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313454ec5ee656af%3A0x53d490c3dd6c965c!2zMyBQLiBQaMO6IEtp4buBdSwgUGjDumMgRGnhu4VuLCBU4burIExpw6ptLCBIw6AgTuG7mWksIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1686425902162!5m2!1svi!2s"
                            width="600" height="450" style={{ border: 0 }} allowFullScreen
                            loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>

                    {/* <!-- CONTACT DETAIL --> */}
                    <div className="contact-detail">
                        <div className="col">
                            <div className="contact-logo">
                                <img width="200px"
                                    src="http://mauweb.monamedia.net/cleverfood/wp-content/uploads/2018/04/logo-mona.png"
                                    alt="" />
                            </div>
                            <div className="contact-content">
                                <div className="contact-address"><i className="fa-solid fa-location-dot"></i>Ngõ 3 Phú Kiều , Phường
                                    Phúc
                                    Diễn, Quận Bắc Từ Liêm, Hà Nội</div>
                                <div className="contact-phone"><i className="fa-solid fa-phone"></i><Link to="">0869827432</Link></div>
                                <div className="contact-email"><i className="fa-solid fa-envelopes-bulk"></i>
                                    <Link to="">ngocdm22052003@gmail.com</Link>
                                </div>
                                <div className="contact-facebook"><i className="fa-brands fa-facebook"></i><Link to="">Đào Minh
                                    Ngọc</Link></div>
                            </div>
                        </div>
                        <div className="contact-title">
                            <h1>LIÊN HỆ VỚI CHÚNG TÔI</h1>
                        </div>
                        <div>
                            <form action="" className="form-contact">
                                <div className="contact-grid">
                                    <input type="text" placeholder="Họ và tên" />
                                    <input type="text" placeholder="Email" />
                                    <input type="text" placeholder="Số điện thoại" />
                                    <input type="text" placeholder="Địa chỉ" />
                                    <textarea name="" placeholder="Lời nhắn" id=""></textarea>
                                </div>
                                <div className="btn-submit">
                                    <button type="submit">GỬI</button>
                                </div>
                            </form>
                        </div>
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
        </div>
    )
}

export default ContactPage