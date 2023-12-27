import { Link } from "react-router-dom";


const Category = () => {
    return (
        <div className="grid grid-cols-[50%,50%] gap-3 absolute mt-[-50px] feature-category-wrapper">
            {/* <!-- image 1 --> */}
            <div className="image">
                <Link to="" className="group overflow-hidden rounded-[20px] relative block">
                    <img
                        className="rounded-[20px]  shadow hover:scale-105  transition-all"
                        src="https://res.cloudinary.com/djlylbhrb/image/upload/v1693770963/project_fruit/j2i7nf9lwiktmcporsfg.jpg"
                        alt="" />
                </Link>
            </div>
            {/* <!-- image 2 --> */}
            <div className="image">
                <Link to="" className="group overflow-hidden rounded-[20px] relative block">
                    <img className="rounded-[20px]  shadow hover:scale-105  transition-all" src="https://res.cloudinary.com/djlylbhrb/image/upload/v1693770915/project_fruit/fsjvkklu5bozcljdmql9.jpg"
                        alt="" />
                </Link>
            </div>
            {/* <!-- image 3 --> */}
            <div className="image">
                <Link to="" className="group overflow-hidden rounded-[20px] relative block">
                    <img className="rounded-[20px]  shadow hover:scale-105  transition-all" src="https://res.cloudinary.com/djlylbhrb/image/upload/v1702734045/project_fruit/zehgu0hcrq8eyihdj6cx.jpg"
                        alt="" />
                </Link>
            </div>
            {/* <!-- image 4 --> */}
            <div className="image">
                <Link to="" className="group overflow-hidden rounded-[20px] relative block">
                    <img className="rounded-[20px]  shadow hover:scale-105  transition-all" src="https://res.cloudinary.com/djlylbhrb/image/upload/v1702734046/project_fruit/gc9djinwxarpe8opcdqu.jpg"
                        alt="" />
                </Link>
            </div>
        </div>
    );
};

export default Category;
