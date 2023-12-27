import { Button, Pagination, Popconfirm, Space, Table, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { IProduct } from '../../../types/Product';
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Image } from 'antd';
import { ICategory } from '../../../types/Category';
import { SearchProduct, deleteProductSoft } from '../../../api/Product';
import { useContext, useEffect, useMemo, useState } from 'react';
import { ProductContext } from '../../../provider/ProductProvider';
import { toast } from 'react-toastify';
import { searchCategory } from '../../../api/Category';

//========================================================================================================
const ProductList = () => {
    const { state: products, dispatch } = useContext(ProductContext);
    const [categories, setCategory] = useState<ICategory[]>([]);
    const [currentPages, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(1);
    const [_keywords] = useState('');
    const dataProduct = useMemo(() => products?.products, [products])
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
                const { data } = await SearchProduct(dataProductReq);
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
    const onHandleRemove = async (_id: string) => {
        try {
            const { data } = await deleteProductSoft(_id);
            if (data.success) {
                dispatch({ type: "product/delete", payload: data.deletedProduct._id })
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
            width: 200,
            render: (record) => {
                return record
            }
        },
        {
            title: 'Ảnh sản phẩm',
            dataIndex: 'product_image',
            key: 'images',
            render: (record) => {
                return (
                    <Image
                        width={100}
                        height={100}
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
            render: (record) => (record?.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
            }))
        },
        {
            title: 'Khuyến mãi',
            dataIndex: 'product_discount',
            key: 'discount',
            render: (value) => (value?.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
            }))
        },
        {
            title: 'Số lượng',
            dataIndex: 'product_quantity',
            key: 'quantity',
            sorter: (a, b) => a.product_quantity - b.product_quantity,
        },
        // {
        //     title: 'Mô tả',
        //     dataIndex: 'product_description_sort',
        //     key: 'description',
        //     render: (record) => {
        //         if (record?.length > 15) {
        //             return record.slice(0, 15).concat("...");
        //         } else {
        //             return record;
        //         }
        //     }
        // },
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
                        onConfirm={() => onHandleRemove(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button><DeleteOutlined style={{ fontSize: '20px', color: '#f5222d', outline: 'none' }} /></Button>
                    </Popconfirm>
                    <Button><Link to={`/admin/products/${record._id}/update`}><EditOutlined style={{ fontSize: '20px', color: '#08c' }} /></Link></Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div className="flex items-center justify-between p-4">
                <h1 className="text-xl font-bold">Danh sách sản phẩm</h1>
                <div className="flex items-center gap-2">
                    <button className="bg-green-600 hover:bg-green-700 hover:text-white text-white transition-all  px-2 py-1 rounded-lg">
                        <Link to="/admin/products/add">Thêm mới</Link>
                    </button>
                    <Link to="/admin/products/bin" className="flex items-center gap-1 text-white cursor-pointer bg-gray-700 hover:bg-gray-800  transition-all  px-2 py-1 rounded-lg">
                        <h1>Thùng rác</h1>
                        <i className="fa-solid fa-trash"></i>
                    </Link>
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
                    dataSource={dataProduct?.length > 0 && dataProduct?.map((item: any, index: any) => ({ ...item, STT: index }))} pagination={false} />
            </div>
            <Pagination current={currentPages} total={totalItems} onChange={onHandlePageChange} className="mt-5" />
        </div>
    )
}

export default ProductList