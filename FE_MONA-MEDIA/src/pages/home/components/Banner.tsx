import { Link } from "react-router-dom";

const Banner = () => {
    return (
        <div className="slider-wrapper relative grid py-7 grid-cols-[400px,auto] items-center max-w-[1200px] mx-auto">
            <div className="slider-caption text-white">
                <div className="slider-title w-[170px] text-center">
                    <p className="bg-[#86ba09] py-2   text-[20px]">Walnuts</p>
                </div>
                <h1 className="text-shadow text-[50px]">100% tự nhiên</h1>
                <div className="slider-sale">
                    <p className="text-[20px]">Giảm giá khi đặt mua ngay hôm nay</p>
                </div>
                <div className="slider-buy mt-5">
                    <button type="submit"
                        className="bg-[#86ba09] transition-all hover:bg-[#689305] rounded-[30px] py-4 px-20  ">
                        Mua ngay</button>
                </div>
            </div>
            <div className="slider-items">
                <Link to="#" className="max-w-[400px] max-h-[400px]">
                    <img
                        className=""
                        src="http://mauweb.monamedia.net/cleverfood/wp-content/uploads/2019/05/imgslide22.png"
                        alt="" />
                </Link>
            </div>
        </div>
    );
};

export default Banner;
