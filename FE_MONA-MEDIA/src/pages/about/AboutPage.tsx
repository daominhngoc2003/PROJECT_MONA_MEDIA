import { Link } from "react-router-dom";
import "./AboutPage.scss"
const AboutPage = () => {
    return (
        <div>
            <section className="banner-section">
                <div className="banner-wrapper">
                    <h1>GIỚI THIỆU</h1>
                    <div className="banner-content">
                        <Link to="/">TRANG CHỦ</Link>/
                        <Link to="">GIỚI THIỆU</Link>
                    </div>
                </div>
            </section>
            <section className="about-section">
                <div className="about-wrapper">
                    <div className="about-title">
                        <h1>MONA MEDIA</h1>
                    </div>
                    <div className="about-content">
                        <p>MONA MEDIA - một địa chỉ đáng tin cậy dành cho những tín đồ của hoa quả sạch - tươi - ngon ở nội thành Hà Nội.</p>
                    </div>
                    <div className="about-list">
                        <div className="about-col">
                            <div>
                                <div className="">
                                    <img src="https://res.cloudinary.com/djlylbhrb/image/upload/v1691865559/project_fruit/imgslide18_dquekx.png"
                                        alt="" />
                                </div>
                                <div>
                                    <h1>New Features</h1>
                                    <p>MONA MEDIA là đơn vị nhập khẩu và phân phối trực tiếp hoa quả của những quốc gia như Úc, Mỹ, Canada, New Zealand tại thị trường Việt Nam.</p>
                                </div>
                            </div>
                            <div>
                                <div className="">
                                    <img src="http://mauweb.monamedia.net/cleverfood/wp-content/uploads/2019/05/imgslide14.png"
                                        alt="" />
                                </div>
                                <div>
                                    <h1>Responsive</h1>
                                    <p>Không chỉ có các các sản phẩm hoa quả nhập khẩu, MONA MEDIA còn bán các loại trái cây đặc sản từ khắp mọi miền tổ quốc.</p>
                                </div>
                            </div>
                        </div>
                        <div className="about-col">
                            <img width="600px"
                                src="https://res.cloudinary.com/djlylbhrb/image/upload/v1691865560/project_fruit/imgslide22_q22yot.png"
                                alt="" />
                        </div>
                        <div className="about-col">
                            <div>
                                <div className="">
                                    <img src="https://res.cloudinary.com/djlylbhrb/image/upload/v1691865690/project_fruit/imgslide11_epo1yp.png"
                                        alt="" />
                                </div>
                                <div>
                                    <h1>Customize Anything</h1>
                                    <p></p>
                                </div>Để đảm bảo lựa chọn được đúng sản phẩm trái cây tươi sạch vừa an toàn vừa tăng cường sức khỏe, người tiêu dùng chỉ nên mua hàng tại những địa chỉ cung cấp hoa quả đã được kiểm chứng chất lượng - và Sạch Fruits là một trong số đó
                            </div>
                            <div>
                                <div className="">
                                    <img src="https://res.cloudinary.com/djlylbhrb/image/upload/v1691865582/project_fruit/imgslide13-300x274_lfxzfq.png"
                                        alt="" />
                                </div>
                                <div>
                                    <h1>Unlimited Options</h1>
                                    <p>Tôn chỉ hoạt động của MONA MEDIA là cung cấp hoa quả sạch - tươi - ngon với giá cả cạnh tranh nhất, nói không với chất bảo quản, nói không với hàng nhập lậu.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default AboutPage