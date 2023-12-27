import { Button, Pagination, Popconfirm, Space, Table, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Link } from "react-router-dom";
import { Image } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ProductContext } from '../../../../provider/ProductProvider';
import { ICategory } from '../../../../types/Category';
import { deleteProductForce, getProductBin, restoreProduct } from '../../../../api/Product';
import { searchCategory } from '../../../../api/Category';
import { IProduct } from '../../../../types/Product';

const BinProduct = () => {
    const { state: products, dispatch } = useContext(ProductContext);
    const [categories, setCategory] = useState<ICategory[]>([]);
    const [currentPages, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(1);
    const [_keywords] = useState('');
    const dataProduct = products?.products;
    const dataProductReq = {
        // currentPages,
        _keywords,
        _limit: 100
    }
    const datacateReq = {
        // currentPages,
        _keywords,
        _limit: 100
    }

    useEffect(() => {
        (async () => {
            try {
                const { data } = await getProductBin(dataProductReq);
                if (data.success) {
                    await dispatch({ type: "product/search", payload: data.products })
                    setTotalItems(data.pagination.totalItems);
                }
                else {
                    toast.error(data)
                }
            } catch (error: any) {
                toast.error(error?.response?.data?.message);
            }
        })()
    }, [currentPages, _keywords])

    // XỬ LÝ KHI CHUYỂN TRANG
    const onHandlePageChange = (page: number) => {
        setCurrentPage(page);
    }

    // Hàm xử lý xóa
    const onHandleRemoveForce = async (_id: string) => {
        try {
            const { data } = await deleteProductForce(_id);
            console.log(data);

            if (data.success) {
                dispatch({ type: "product/deleteForce", payload: data.deletedProduct._id })
                toast.success(data.message);
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }
    // Hàm xử lý Khôi phục
    const onHandleRestore = async (_id: string) => {
        try {
            const { data } = await restoreProduct(_id);
            console.log(data);
            if (data.success) {
                dispatch({ type: "product/restore", payload: _id })
                toast.success(data.message);
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }
    //=====================================CATEGORY===============================
    // LẤY TẤT CẢ DỮ LIỆU danh mục
    useEffect(() => {
        (async () => {
            try {
                const { data } = await searchCategory(datacateReq);
                if (data.success) {
                    setCategory(data.categories)
                }
                else {
                    message.error(data?.error?.response?.data?.message)
                }

            } catch (error: any) {
                message.error(error.response.data.message);
            }
        })()
    }, [])

    // data table
    const columns: ColumnsType<IProduct> = [
        {
            title: 'STT',
            dataIndex: 'STT',
            key: 'STT',
            render: (record) => {
                return record + 1
            }
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'product_name',
            key: 'name',
            render: (record) => {
                if (record?.length > 15) {
                    return record.slice(0, 15).concat("...");
                } else {
                    return record;
                }
            }
        },
        {
            title: 'Ảnh sản phẩm',
            dataIndex: 'product_images',
            key: 'images',
            render: (record) => {
                return (
                    <Image
                        width={150}
                        src={record?.url}
                    />
                )
            }
        },
        {
            title: 'Giá sản phẩm',
            dataIndex: 'product_price',
            key: 'price',
            sorter: (a, b) => a.product_price - b.product_price,
            render: (record) => `${(record / 1000).toLocaleString('vi-VN')} VND`
        },
        {
            title: 'Khuyến mãi',
            dataIndex: 'product_discount',
            key: 'discount',
            render: (value) => `${value}%`
        },
        {
            title: 'Số lượng',
            dataIndex: 'product_quantity',
            key: 'quantity',
            sorter: (a, b) => a.product_quantity - b.product_quantity,
        },
        {
            title: 'Mô tả',
            dataIndex: 'product_description_sort',
            key: 'description',
            render: (record) => {
                if (record?.length > 15) {
                    return record.slice(0, 15).concat("...");
                } else {
                    return record;
                }
            }
        },
        {
            title: 'Danh mục',
            dataIndex: 'category_id',
            key: 'category_id',
            render: (record) => {
                const catename = categories?.find(cate => cate._id === record);
                return catename?.category_name;
            }
        },
        {
            title: 'Action',
            key: 'action',
            render: (record) => (
                <Space size="middle">
                    <Popconfirm
                        placement="top"
                        title={"Bạn muốn xóa?"}
                        onConfirm={() => onHandleRemoveForce(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button>Xóa vĩnh viễn</Button>
                    </Popconfirm>
                    <Button onClick={() => onHandleRestore(record._id)}>Khôi phục</Button>
                </Space>
            ),
        },
    ];
    return (
        // <div>
        //     <h1 style={{ color: 'red', fontSize: '20px', textAlign: 'center' }}>Quản lý sản phẩm</h1>
        //     <Table columns={columns} dataSource={dataProduct} />
        //     <Pagination current={currentPages} total={totalItems} onChange={onHandlePageChange} />
        // </div >
        <div>
            <div className="flex items-center justify-between p-4">
                <h1 className="text-xl font-bold">Danh sách sản phẩm</h1>
                <div className="flex items-center gap-2">
                    <Button className="bg-green-600 hover:bg-green-700 hover:text-white text-white transition-all  px-2 py-1 rounded-lg">
                        <Link to="/admin/products">Quay lại</Link>
                    </Button>
                </div>
            </div>
            {/* <form onSubmit={handleSubmit(onHandleSubmit as any)} className="w-full bg-gray-50 py-2 px-2 mb-5 text-gray-600 shadow grid grid-cols-6">
                <div className="max-w-[200px] bg-black">
                    <input
                        {...register("product_name")}
                        className="py-2 w-full outline-none border px-2"
                        type="text"
                        placeholder="Tên sản phẩm" />
                </div>
                <div className="max-w-[200px] bg-black">
                    <input
                        {...register("product_code")}
                        className="py-2 w-full outline-none border px-2"
                        type="text"
                        placeholder="Mã sản phẩm" />
                </div>
                <div className="max-w-[200px] bg-black">
                    <select
                        {...register("category_id")}
                        className="py-2 w-full h-full outline-none border px-2"
                        id="">
                        <option value="">Danh mục</option>
                        {categoryList?.map((cate: ICategory) => (
                            <option key={cate._id} value={cate._id}>
                                {cate.category_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="max-w-[200px] bg-black">
                    <select
                        {...register("brand_id")}
                        className="py-2 w-full h-full outline-none border px-2"
                        id="">
                        <option value="">Thương hiệu</option>
                        {brandList?.map((brand: IBrand) => (
                            <option key={brand._id} value={brand._id}>
                                {brand.brand_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="max-w-[70px]">
                    <button className="py-2 w-full rounded-full hover:bg-gray-100 transition-all h-full outline-none border px-2 ">
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                </div>
            </form> */}

            <div className=" shadow-lg border border-gray-100 rounded-[30px] bg-white  p-5">
                <Table columns={columns}
                    dataSource={products?.products && dataProduct?.map((item: any, index: any) => ({ ...item, STT: index }))} pagination={false} />
            </div>
            <Pagination current={currentPages} total={totalItems} onChange={onHandlePageChange} className="mt-5" />
        </div>
    );
};

export default BinProduct;
