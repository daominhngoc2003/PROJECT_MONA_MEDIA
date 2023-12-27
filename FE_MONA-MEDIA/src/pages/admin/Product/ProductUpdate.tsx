import { useContext, useEffect, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { Spin, message } from "antd";
import { LoadingOutlined } from '@ant-design/icons';


import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { getProductById, updateProduct } from "../../../api/Product";
import { RemoveImages, UpdateImage, UploadImages } from "../../../api/Upload";
import { toast } from "react-toastify";
import { IProduct } from "../../../types/Product";
import { ProductContext } from "../../../provider/ProductProvider";
import { searchCategory } from "../../../api/Category";

const ProductUpdate = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingImage, setIsLoadingImage] = useState(false);
    const { state: productDetail, dispatch } = useContext(ProductContext);
    const [categories, setCategory] = useState<any>([]);
    const product = productDetail.products;

    // image
    const [imagesLarge, setImageLarge] = useState<any>({});
    const [publicId, setPublicId] = useState<any>("");

    // useRef
    const fileInputRef = useRef<any>(null);

    const {
        register,
        handleSubmit,
        watch,
        control,
        setValue,
        reset,
        formState: { errors },
    } = useForm<IProduct>({
        defaultValues: {
            product_description_short: product?.product_description_short || '',
            product_description_long: product?.product_description_long || '',
        },
    });

    useEffect(() => {
        const fetPro = async () => {
            const { data } = await getProductById(id as any);
            if (data) {
                await dispatch({ type: "product/getDetail", payload: data.product })
            }
        }
        fetPro()
    }, [])

    useEffect(() => {
        const fetPro = async () => {
            const { data } = await searchCategory({ _limit: 100 } as any);
            if (data) {
                setCategory(data.categories)
            }
        }
        fetPro()
    }, [])

    // react-hook-form


    useEffect(() => {
        reset(product);
        if (product) {
            if (product?.product_discount) {
                const productPercent = ((product?.product_price - product?.product_discount) * 100) / product?.product_price;
                setValue('product_discount', productPercent);
            }
            setValue('category_id', product?.category_id);
            setValue('product_description_short', product.product_description_short || '');
            setValue('product_description_long', product.product_description_long || '');
        }
        setImageLarge(product?.product_image)
    }, [product, setValue, reset]);


    // event image
    const handleFileChangeImage = async (event: any) => {
        const newImages = event.target.files[0];
        const urlImage = URL.createObjectURL(newImages);
        setIsLoadingImage(true);
        try {
            const imagereq: any = { files: newImages, url: urlImage };
            if (publicId && fileInputRef.current) {
                const formDataImageUpdate = new FormData();
                formDataImageUpdate.append("images", newImages);
                const data = await UpdateImage({
                    publicId,
                    formDataImageUpdate,
                } as any);
                const result: any = await updateProduct({
                    ...product,
                    product_image: data,
                });
                if (result.success) {
                    message.success(`${result.message}`);
                }
            }
            setImageLarge(imagereq);
        } catch (error) {
            console.log("Error uploading images: ", error);
        } finally {
            setIsLoadingImage(false);
        }
    };

    // event remove image
    const onHandleRemoveImagelarge = async (_id: string) => {
        try {
            const image: any = { ...product, product_image: {} }

            const data: any = await RemoveImages(_id);
            if (data.result) {
                const data: any = await updateProduct(image);
                if (data.success) {
                    message.success(`${data.message}`)
                    await setImageLarge({});
                } else {
                    message.error(`${data.message}`);
                }
            } else {
                const data: any = await updateProduct(image);
                if (data.success) {
                    message.success(`${data.message}`)
                } else {
                    await setImageLarge({});
                    message.error(`${data.message}`);
                }
            }
        } catch (error: any) {
            message.error(error);
        }
    }
    const onHandleUpdateImagelarge = async (id: string) => {
        setPublicId(id);
        try {
            if (fileInputRef.current) {
                fileInputRef.current?.click();
            }
        } catch (error: any) {
            message.error(error);
        }
    };

    const onHandleSubmit = async (pro: any) => {
        setIsLoading(true);
        const selectedCategoryId = watch("category_id");
        const selectedGroupId = watch("group_id");

        const discountAmount = (pro.product_price * pro.product_discount) / 100;

        const discountedPrice = pro.product_price - discountAmount;

        let formData: any = {
            ...pro,
            category_id: selectedCategoryId === "" ? undefined : selectedCategoryId,
            group_id: selectedGroupId === "" ? undefined : selectedGroupId,
            product_image: pro.product_image ? pro.product_image : imagesLarge,
            product_discount: Number(pro.product_discount) === 0 ? 0 : discountedPrice
        };

        // Upload main image if available
        if (imagesLarge && imagesLarge.files) {
            const formDataImage = new FormData();
            formDataImage.append("images", imagesLarge.files);
            const db: any = await UploadImages(formDataImage);
            formData.product_image = db?.data?.urls[0] ? db.data.urls[0] : product.product_image;
        }

        try {
            const { data }: any = await updateProduct(formData);
            if (data.success === true) {
                navigate("/admin/products")
                toast.success("Cập nhập thành công")
            } else {
                console.log(data);

                toast.error(data?.message)
            }
        } catch (error: any) {
            message.error("Error: " + error?.response?.data?.message);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="overflow-x-auto ">
            {isLoading && (
                <div className="fixed inset-0 bg-black opacity-50 z-50"></div>
            )}

            {/* Spin component */}
            {isLoading && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                </div>
            )}
            {isLoadingImage && (
                <div className="fixed inset-0 bg-black opacity-50 z-50"></div>
            )}

            {/* Spin component */}
            {isLoadingImage && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                </div>
            )}

            <div className="bg-white shadow-md p-5 border rounded-[50px] border-gray-100">
                <h1 className="text-center font-medium text-gray-900 uppercase text-[28px]">
                    Cập nhật sản phẩm
                </h1>
                <form onSubmit={handleSubmit(onHandleSubmit as any)}>
                    <div className=" py-10">
                        <div className="min-h-32 grid grid-cols-4 gap-5">
                            <div className="bg-gray-50 shadow-md col-span-3 rounded-md">
                                <div className="grid grid-cols-1  gap-2 lg:grid-cols-2 lg:gap-4 p-4">
                                    <div>
                                        <label htmlFor="" className="font-bold text-[19px]">
                                            Tên sản phẩm
                                        </label>
                                        <br />
                                        <input
                                            type="text"
                                            defaultValue={product?.product_name}
                                            {...register("product_name", {
                                                required: "Tên sản phẩm không được bỏ trống ",
                                                minLength: {
                                                    value: 2,
                                                    message: "Tên sản phẩm tối thiểu 2 kí tự",
                                                },
                                            })}
                                            placeholder="Tên sản phẩm ..."
                                            className=" shadow-md w-full px-3 py-4 rounded-md mt-2 focus:border-b border-b  focus:border-blue-400  focus:duration-150 outline-none hover:shadow text-[16px]"
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
                                            defaultValue={product?.product_code}
                                            {...register("product_code", {
                                                required: "Tên sản phẩm không được bỏ trống ",
                                            })}
                                            placeholder="Tên sản phẩm ..."
                                            className=" shadow-md w-full px-3 py-4 rounded-md mt-2 focus:border-b border-b  focus:border-blue-400  focus:duration-150 outline-none hover:shadow text-[16px]"
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
                                                minLength: { value: 3, message: "Tối thiểu 3 kí tự" },
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
                                                min: { value: 0, message: "Tối thiểu 0" },
                                                max: { value: 100, message: "Tối thiểu 100" },
                                            },
                                            )}
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
                                            value={watch("category_id")} // Lấy giá trị hiện tại của category_id
                                            onChange={(e) => setValue("category_id", e.target.value)} // Cập nhật giá trị khi người dùng thay đổi select
                                            className="shadow-md w-full px-3 py-4 rounded-md mt-2 focus:border-b border-b focus:border-blue-400 focus:duration-150 outline-none hover:shadow text-[16px]"
                                        >
                                            {categories?.map((cate: any) => (
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
                                            rules={{
                                                required: "Trường mô tả không được để trống",
                                                minLength: {
                                                    value: 5,
                                                    message: "At least 5 characters required",
                                                },
                                            }}
                                            render={({ field }) => (
                                                <CKEditor
                                                    editor={ClassicEditor}
                                                    data={field.value}
                                                    onChange={(event, editor) => {
                                                        console.log(event);

                                                        field.onChange(editor.getData()); // Retrieve data without passing any arguments
                                                    }}
                                                />
                                            )}
                                        />
                                        <div className="text-red-500">
                                            {errors?.product_description_short &&
                                                errors?.product_description_short?.message}
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
                                            rules={{
                                                required: "Trường mô tả không được để trống",
                                                minLength: {
                                                    value: 5,
                                                    message: "At least 5 characters zrequired",
                                                },
                                            }}
                                            render={({ field }) => (
                                                <CKEditor
                                                    editor={ClassicEditor}
                                                    data={field.value}
                                                    onChange={(event, editor) => {
                                                        console.log(event);

                                                        field.onChange(editor.getData()); // Retrieve data without passing any arguments
                                                    }}
                                                />
                                            )}
                                        />
                                        <div className="text-red-500">
                                            {errors?.product_description_long &&
                                                errors?.product_description_long?.message}
                                        </div>
                                    </div>


                                </div>

                            </div>

                            <div
                                className={`p-4 bg-[#edf1fa]  rounded-lg dark:border-gray-700`}
                            >
                                <ul id="gallery" className="h-auto grid grid-cols-3 gap-3">
                                    {imagesLarge && imagesLarge ? (
                                        <div className="relative w-full h-[250px] col-span-3 border shadow-md bg-gray-200">
                                            <span
                                                className="absolute top-2 right-2 border cursor-pointer hover:bg-red-500 text-white transition-all duration-300 rounded-full bg-red-400 px-2"
                                                onClick={() =>
                                                    onHandleRemoveImagelarge(
                                                        product?.product_image?.publicId
                                                    )
                                                }
                                            >
                                                x
                                            </span>
                                            <span
                                                className="absolute top-2 left-2 border cursor-pointer hover:bg-red-500 text-white transition-all duration-300 rounded-full bg-red-400 px-2"
                                                onClick={() => {
                                                    onHandleUpdateImagelarge(
                                                        product?.product_image?.publicId
                                                    );
                                                }}
                                            >
                                                edit
                                            </span>
                                            <input
                                                type="file"
                                                onChange={handleFileChangeImage}
                                                className="hidden"
                                            />
                                            <img
                                                src={imagesLarge?.url}
                                                className="w-full h-full object-cover"
                                                alt="Image"
                                            />
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                    {!imagesLarge && (
                                        <div className="relative w-full h-[250px] col-span-3 flex justify-center">
                                            <div className="rounded-lg shadow-xl bg-gray-50 m-4 px-2 w-full">
                                                <label className="block mb-2 text-gray-500">
                                                    File Upload
                                                </label>
                                                <div className="flex items-center justify-center px-2">
                                                    <label className="flex flex-col w-full h-32 border-4 border-blue-200 border-dashed hover:bg-gray-100 hover:border-gray-300">
                                                        <div className="flex flex-col items-center justify-center pt-7">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="w-8 h-8 text-gray-400 group-hover:text-gray-600"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                                />
                                                            </svg>
                                                            <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                                                                Upload Images
                                                            </p>
                                                        </div>
                                                        <input
                                                            type="file"
                                                            onChange={handleFileChangeImage}
                                                            ref={fileInputRef}
                                                            className="opacity-0"
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </ul>
                                <div className="flex gap-2  h-[50px] mt-6">
                                    <div className="w-full h-full text-center">
                                        <Link
                                            to="/admin/products"
                                            className="bg-gray-500 px-5 pt-3 h-full block rounded-sm right-10 text-white text-center hover:bg-gray-600 transition-all duration-200 "
                                        >
                                            Quay lại
                                        </Link>
                                    </div>
                                    <div className="w-full h-full">
                                        <button
                                            disabled={isLoading}
                                            className="bg-green-500 px-6 rounded-sm h-full w-full  text-white hover:bg-green-600 transition-all duration-200"
                                        >
                                            Cập nhật
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductUpdate