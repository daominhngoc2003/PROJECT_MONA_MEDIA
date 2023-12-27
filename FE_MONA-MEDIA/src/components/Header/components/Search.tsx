import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Modal } from "antd";
import { getProductClient } from "../../../api/Product";
import { getCategoriesClient } from "../../../api/Category";

// const dataFakePrice = [
//     { value: { maxPrice: 500000 }, title: "Dưới 500,000₫" },
//     { value: { minPrice: 500000, maxPrice: 2000000 }, title: "500,0000₫ - 2,000,000₫" },
//     {
//         value: { minPrice: 2000000, maxPrice: 3000000 },
//         title: "2,000,000₫ - 3,000,000₫",
//     },
//     {
//         value: { minPrice: 3000000, maxPrice: 5000000 },
//         title: "3,000,000₫ - 5,000,000₫",
//     },
//     { value: { maxPrice: 10000000 }, title: "Dưới 10 triệu" },
//     { value: { minPrice: 10000000 }, title: "Trên 10 triệu" },
// ];

const Search = () => {
    const [keys, setKeys] = useState<any>('');
    const [categoryKey, setCategory] = useState<any>([]);
    // const [selectedValue, setSelectedValue] = useState<any>([]);
    // const [PriceFilter, setPriceFilter] = useState<any>([]);
    const [products, setproducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const ProductList: any = useMemo(() => products, [products]);
    const CategoryList: any = useMemo(() => categories, [categories]);

    // useEffect(() => {
    //     const queryString: any = Object.entries(selectedValue)
    //         .map(([key, value]) => `${key}=${value}`)
    //         .join("&");
    //     setPriceFilter(queryString);
    // }, [selectedValue]);

    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchPro = async () => {
            try {
                const datareq = {
                    product_name: keys,
                    _limit: 5,
                    category_id: categoryKey ? categoryKey : '',
                    // PriceFilter
                }
                const { data } = await getProductClient(datareq);
                if (data.success) {
                    setproducts(data?.products);
                }
            } catch (error) {
                setproducts([]);
                console.log(error);
            }
        }
        fetchPro()
    }, [keys, categoryKey])

    useEffect(() => {
        const fetchPro = async () => {
            try {
                const datareq = {
                    _limit: 5,
                }
                const { data } = await getCategoriesClient(datareq);
                if (data.success) {
                    setCategories(data?.categories);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchPro()
    }, [keys])


    const onHandleSearch = async (value: any) => {
        const values: any = value.target.value;
        try {
            setKeys(values)
        } catch (error) {
            console.log(error);
        }
    }

    const onHandleCategory = async (value: any) => {
        const values: any = value.target.value;
        try {
            setCategory(values)
        } catch (error) {
            console.log(error);
        }
    }

    // const onHandlePrice = (event: any) => {
    //     const selectedTitle = event.target.value;

    //     const selectedItem: any = dataFakePrice.find((item) => item.title === selectedTitle);
    //     if (selectedItem) {
    //         setSelectedValue(selectedItem.value);
    //     }
    // };
    const handleCancel = () => {
        setOpen(false);
    };

    const onHandleButtonSearch = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const values: any = keys;
        try {
            setKeys(values);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <div
                className="icon-search group cursor-pointer text-[20px] text-gray-500"
                onClick={() => setOpen(true)}>
                <i className="fa-solid fa-magnifying-glass hover:text-[#ca6f04] transition-all"></i>
            </div>
            <Modal
                title="Chọn mã voucher"
                open={open}
                // onOk={handleOk}
                onCancel={handleCancel}
                okButtonProps={{ disabled: false, className: 'text-black border border-black', style: { display: 'none' } }}
                cancelButtonProps={{ disabled: false, style: { display: 'none' } }}
                width={1000}
                className='mt-[-40px]'
            >
                <form
                    onSubmit={onHandleButtonSearch}
                    className="grid grid-cols-5 gap-y-2 gap-x-1 items-center border rounded-md border-gray-200 shadow-sm p-2">
                    <div className="flex items-center border col-span-1">
                        <select
                            onChange={onHandleCategory}
                            className="py-[9px] w-full px-2 bg-gray-100  outline-none">
                            <option value="">Chọn danh mục</option>
                            {CategoryList && CategoryList?.map((item: any) => {
                                return (
                                    <option key={item._id} value={item._id}>
                                        {item.category_name}
                                    </option>
                                )
                            })}
                        </select>
                    </div>
                    <div className="relative w-full mt-2 sm:mt-0 col-span-4">
                        <input
                            type="search"
                            onChange={() => onHandleSearch(event)}
                            className="block px-2 w-full py-[9px] text-sm text-gray-900 bg-gray-100 rounded-r-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                            placeholder="Tên sản phẩm muốn tìm"
                            required
                        />
                        <button
                            type="submit"
                            className="absolute top-0 right-0 h-full py-2 px-4 transition-all text-sm font-medium text-white bg-blue-700 rounded-r-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
                        >
                            <i className="fa-solid fa-magnifying-glass"></i>
                            <span className="sr-only">Search</span>
                        </button>
                    </div>
                    {/* <div className="flex items-center border col-span-1">
                        <select
                            onChange={onHandlePrice}
                            className="py-[9px] w-full px-2 bg-gray-100  outline-none">
                            <option value="">Chọn mức giá</option>
                            {dataFakePrice?.map((item: any) => {
                                return (
                                    <option key={item._id} value={item._id}>
                                        {item.title}
                                    </option>
                                )
                            })}
                        </select>
                    </div> */}
                </form>
                <div className="min-h-[300px]">
                    {ProductList?.length < 1 || !ProductList ? (
                        <div className="w-full border min-h-[200px] flex items-center justify-center mt-5 shadow-sm bg-gray-100">Không có sản phẩm nào</div>
                    ) : (
                        <div>
                            {ProductList && ProductList?.map((item: any) => {
                                return (
                                    <Link to={`/products/${item?._id}`}
                                        onClick={() => setOpen(false)}
                                        className="flex item-center justify-between mt-4 border py-2 px-2 hover:bg-gray-50">
                                        <div className="flex item-center gap-2">
                                            <div className="w-[30px] border h-[30px]">
                                                <img src={item?.product_image?.url} alt="" />
                                            </div>
                                            <h1><Link onClick={() => setOpen(false)} to={`/products/${item?._id}`}>{item?.product_name}</Link></h1>
                                        </div>
                                        <div>
                                            {item.product_discount ? (
                                                <div className="flex items-center gap-2">
                                                    <del>
                                                        <span className="text-gray-500">
                                                            {item?.product_price?.toLocaleString(
                                                                "vi-VN",
                                                                {
                                                                    style: "currency",
                                                                    currency: "VND",
                                                                }
                                                            )}
                                                        </span>
                                                    </del>
                                                    <span className="text-red-500">
                                                        {item?.product_discount?.toLocaleString(
                                                            "vi-VN",
                                                            {
                                                                style: "currency",
                                                                currency: "VND",
                                                            }
                                                        )}
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="text-red-500">
                                                    {item?.product_price?.toLocaleString(
                                                        "vi-VN",
                                                        {
                                                            style: "currency",
                                                            currency: "VND",
                                                        }
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    )
                    }
                </div >
                {/* : <div className="min-h-[200px] flex items-center justify-center border mt-3 bg-gray-100">Không có sản phẩm nào</div> */}
            </Modal >
        </div >
    );
};

export default Search;
