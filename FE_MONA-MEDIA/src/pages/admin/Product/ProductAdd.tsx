import { useContext, useEffect, useState } from 'react';

import { Spin, message } from 'antd';
import { addProduct } from '../../../api/Product';
import { ProductContext } from '../../../provider/ProductProvider';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { ICategory } from '../../../types/Category';
import { searchCategory } from '../../../api/Category';
import { UploadImages } from '../../../api/Upload';
import { Controller, useForm } from 'react-hook-form';
import { IProduct } from '../../../types/Product';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { LoadingOutlined } from '@ant-design/icons';

///////////////////////////////////////

const ProductAdd = () => {
    const { dispatch } = useContext(ProductContext);
    const [isLoading, setIsloading] = useState(false);
    const navigate = useNavigate();
    const [categories, setCategory] = useState<ICategory[]>([]);
    const { register, handleSubmit, formState: { errors }, control, setValue, watch } = useForm<IProduct>();
    // image
    // const [imagesUpload, setImageUpload] = useState<{ files: File[], url: string[] } | any>(null);
    const [imagesLarge, setImageLarge] = useState<any>({});

    const dataCateReq = {
        // currentPages,
        _limit: 100
    }
    console.log(imagesLarge);

    const handleDescriptionShort = (_event: any, editor: any) => {
        const data = editor.getData();
        setValue('product_description_short', data);
    };

    const handleDescriptionLong = (_event: any, editor: any) => {
        const data = editor.getData();
        setValue('product_description_long', data);
    };

    const handleFileChangeImage = (event: any) => {
        const newImages = event.target.files[0];
        const urlImage = URL.createObjectURL(newImages);
        const imagereq: any = { files: newImages, url: urlImage };
        setImageLarge(imagereq)
    };

    // const handleFileChange = async (event: any) => {
    //     const newImages = event.target.files ? Array.from(event.target.files) : []
    //     const oldImages = imagesUpload ? imagesUpload.files : [];
    //     // Kết hợp danh sách ảnh cũ với danh sách ảnh mới
    //     const combinedImages = [...oldImages, ...newImages];

    //     if (combinedImages.length > 12) {
    //         const sliceImage = combinedImages.slice(0, 12);
    //         message.error("Số lượng chỉ cho phép 12 ảnh. Nếu vượt quá số ảnh cho phép thì chỉ lấy được 12 ảnh đầu tiên");
    //         const imageUrls = sliceImage.map((file: any) => URL.createObjectURL(file));
    //         const imagereq: any = { files: sliceImage, url: imageUrls };
    //         setImageUpload(imagereq);
    //     } else {
    //         const imageUrls = combinedImages.map((file: any) => URL.createObjectURL(file));
    //         const imagereq: any = { files: combinedImages, url: imageUrls };
    //         setImageUpload(imagereq);
    //     }
    // };

    // const onHandleRemoveImage = async (index: number) => {
    //     try {
    //         const fileImage = [...imagesUpload.files];
    //         const urlImage = [...imagesUpload.url];
    //         fileImage.splice(index, 1);
    //         urlImage.splice(index, 1);
    //         const updatedImages = { files: fileImage, url: urlImage };
    //         setImageUpload(updatedImages);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    const onHandleRemoveImagelarge = (event: any) => {
        event.stopPropagation();
        setImageLarge({});
    }


    const onHandleSubmit = async (product: any) => {
        const selectCategory = watch("category_id")
        setIsloading(true)
        // const uploadPromises = imagesUpload?.files?.map((file: any) => {
        //     const formData = new FormData();
        //     formData.append("images", file);
        //     return UploadImages(formData);
        // });

        // let updatedImages = []; // Default to an empty array

        const discountAmount = (product.product_price * product.product_discount) / 100;
        const discountedPrice = product.product_price - discountAmount;
        // if (uploadPromises) {
        //     const data = await Promise.all(uploadPromises);
        //     updatedImages = data.map((item: any) => item?.data?.urls[0]);
        // }

        // upload image main
        let imageLargeReq = {};
        if (imagesLarge) {
            const formDataImage = new FormData();
            formDataImage.append("images", imagesLarge.files);
            const db: any = await UploadImages(formDataImage);
            imageLargeReq = db?.data?.urls[0];
        }
        try {

            const productReq = {
                ...product,
                product_price: Number(product?.product_price),
                product_discount: Number(product.product_discount) === 0 ? 0 : discountedPrice,
                product_quantity: Number(product?.product_quantity),
                product_image: imageLargeReq,
                // thumbnail: updatedImages,
                category_id: selectCategory ? selectCategory : undefined
            }

            const { data } = await addProduct(productReq);
            if (data.success) {
                dispatch({ type: "product/add", payload: data.product })
                toast.success(data.message);
                navigate("/admin/products")
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message);
            console.log(error);
        } finally {
            setIsloading(false)
        }
    };

    //=====================================CATEGORY===============================
    // LẤY TẤT CẢ DỮ LIỆU danh mục
    useEffect(() => {
        (async () => {
            try {
                const { data } = await searchCategory(dataCateReq);
                if (data.success) {
                    setCategory(data.categories)
                }
                else {
                    message.error(data.error.response.data.message)
                }
            } catch (error: any) {
                toast.error(error.response.data.message);
            }
        })()
    }, [])

    return (
        <div>
            {isLoading && (
                <div className="fixed inset-0 bg-black opacity-50 z-50"></div>
            )}

            {/* Spin component */}
            {isLoading && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                </div>
            )}

            <form onSubmit={handleSubmit(onHandleSubmit)}>
                <div className="flex justify-between gap-2 bg-white w-full px-2 py-2">
                    <div>
                        <h1 className="text-center font-medium text-gray-900 text-[30px]">
                            Thêm sản phẩm
                        </h1>
                    </div>
                    <div className="flex gap-2 ">
                        <Link
                            to="/admin/products"
                            className="bg-gray-500 px-2 py-2 rounded-sm   right-10 text-white hover:bg-gray-600 transition-all duration-200"
                        >
                            Quay lại
                        </Link>
                        <button className="bg-green-500 px-6  py-2   rounded-sm mr-auto   text-white hover:bg-green-600 transition-all duration-200">
                            Thêm
                        </button>
                    </div>
                </div>
                <div className="bg-gray-50 shadow-md border border-gray-100  rounded-md">

                    <div className="grid grid-cols-1  gap-2 lg:grid-cols-2 lg:gap-4 p-4">
                        <div>
                            <label htmlFor="" className="font-bold text-[19px]">
                                Tên sản phẩm
                            </label>
                            <br />
                            <input
                                type="text"
                                {...register("product_name", {
                                    required: "Tên sản phẩm không được bỏ trống ",
                                    minLength: { value: 2, message: "Tên sản phẩm tối thiểu 2 kí tự" },
                                })}
                                placeholder="Tên sản phẩm ..."
                                className=" shadow-sm w-full px-3 py-4 rounded-sm mt-2 focus:border-b border-b  focus:border-blue-400  focus:duration-150 outline-none hover:shadow text-[16px]"
                            />
                            <div className="text-red-500">
                                {errors?.product_name && errors?.product_name?.message}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="" className="font-bold text-[19px]">
                                Mã sản phẩm
                            </label>
                            <br />
                            <input
                                type="text"
                                {...register("product_code", {
                                    required: "Tên sản phẩm không được bỏ trống ",
                                    minLength: { value: 3, message: "Tối thiểu 3 kí tự" },
                                })}
                                placeholder="Tên sản phẩm ..."
                                className=" shadow-sm w-full px-3 py-4 rounded-sm mt-2 focus:border-b border-b  focus:border-blue-400  focus:duration-150 outline-none hover:shadow text-[16px]"
                            />
                            <div className="text-red-500">
                                {errors?.product_code && errors?.product_code?.message}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="" className="font-bold text-[19px]">
                                Giá sản phẩm
                            </label>
                            <br />
                            <input
                                type="text"
                                {...register("product_price", {
                                    required: "Tên sản phẩm không được bỏ trống ",
                                })}
                                placeholder="Giá sản phẩm ..."
                                className=" shadow-sm w-full px-3 py-4 rounded-sm mt-2 focus:border-b border-b  focus:border-blue-400  focus:duration-150 outline-none hover:shadow text-[16px]"
                            />
                            <div className="text-red-500">
                                {errors?.product_price && errors?.product_price?.message}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="" className="font-bold text-[19px]">
                                Giảm giá (%)
                            </label>
                            <br />
                            <input
                                type="text"
                                {...register("product_discount", {
                                    required: "Tên sản phẩm không được bỏ trống ",
                                })}
                                placeholder="% ..."
                                className=" shadow-sm w-full px-3 py-4 rounded-sm mt-2 focus:border-b border-b  focus:border-blue-400  focus:duration-150 outline-none hover:shadow text-[16px]"
                            />
                            <div className="text-red-500">
                                {errors?.product_discount && errors?.product_discount?.message}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="" className="font-bold text-[19px]">
                                Số lượng
                            </label>
                            <br />
                            <input
                                type="text"
                                {...register("product_quantity", {
                                    required: "Tên sản phẩm không được bỏ trống ",
                                })}
                                placeholder="% ..."
                                className=" shadow-sm w-full px-3 py-4 rounded-sm mt-2 focus:border-b border-b  focus:border-blue-400  focus:duration-150 outline-none hover:shadow text-[16px]"
                            />
                            <div className="text-red-500">
                                {errors?.product_quantity && errors?.product_quantity?.message}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="" className="font-bold text-[19px]">
                                Danh mục
                            </label>
                            <br />
                            <select
                                {...register("category_id")}
                                className="shadow-sm w-full px-3 py-4 rounded-sm mt-2 focus:border-b border-b focus:border-blue-400 focus:duration-150 outline-none hover:shadow text-[16px]"
                            >
                                <option value="">Chọn</option>
                                {categories?.map((cate: ICategory) => (
                                    <option key={cate._id} value={cate._id}>
                                        {cate.category_name}
                                    </option>
                                ))}
                            </select>
                            <div className="text-red-500">
                                {errors?.category_id && errors?.category_id?.message}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="" className="font-bold text-[19px]">
                                Mô tả ngắn
                            </label>
                            <br />
                            <Controller
                                name="product_description_short"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: 'Mô tả ngắn sản phẩm không được bỏ trống',
                                    minLength: {
                                        value: 5,
                                        message: 'Tối thiểu 5 kí tự',
                                    },
                                }}
                                render={() => (
                                    <CKEditor
                                        editor={ClassicEditor}
                                        onChange={handleDescriptionShort}
                                    />
                                )}
                            />
                            <div className="text-red-500">
                                {errors?.product_description_short && errors?.product_description_short?.message}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="" className="font-bold text-[19px]">
                                Mô tả dài
                            </label>
                            <br />
                            <Controller
                                name="product_description_long"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: 'Mô tả dài sản phẩm không được bỏ trống',
                                    minLength: {
                                        value: 5,
                                        message: 'Tối thiểu 5 kí tự',
                                    },
                                }}
                                render={() => (
                                    <CKEditor
                                        editor={ClassicEditor}
                                        onChange={handleDescriptionLong}
                                    />
                                )}
                            />
                            <div className="text-red-500">
                                {errors?.product_description_long && errors?.product_description_long?.message}
                            </div>
                        </div>


                        {/* <div>
                            <label htmlFor="" className="font-bold text-[19px]">Ảnh con</label>
                            <input
                                id="hidden-input"
                                type="file"
                                multiple
                                className="shadow-sm bg-white w-full px-3 py-4 rounded-sm mt-2 focus:border-b border-b focus:border-blue-400 focus:duration-150 outline-none hover:shadow text-[16px]"
                                onChange={handleFileChange}
                            />
                        </div> */}

                        <div className="col-span-2 grid grid-cols-10 bg-white">
                            <div className="col-span-3 w-full   h-[250px]">
                                <div className="flex items-center justify-center  h-[250px] w-full">
                                    {(imagesLarge && imagesLarge.url) ? (
                                        <div className="group relative w-full h-full object-cover">

                                            <img src={imagesLarge?.url} className="w-full h-full object-cover" alt="Uploaded" />
                                            <div className="absolute  top-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span
                                                    onClick={onHandleRemoveImagelarge}
                                                    className="bg-red-500 text-white px-2 py-1 rounded cursor-pointer hover:bg-red-600">Delete</span>
                                                <span className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">Update</span>
                                            </div>
                                        </div>

                                    ) : (
                                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                </svg>
                                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                            </div>
                                            <input
                                                onChange={handleFileChangeImage}
                                                id="dropzone-file"
                                                type="file"
                                                className="hidden" />
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </form >
        </div>
    )
}

export default ProductAdd