import Product from "../models/product.js";
import Category from "../models/category.js";
import { ProductSchema, ProductUpdateSchema } from "../schema/product.js";
export const SearchProduct = async (req, res) => {
  const {
    _page = 1,
    _sort = "createAt",
    _limit = 10,
    _order = "asc",
    _keywords = "",
  } = req.query;
  // Tạo 1 object tên "options" bao gồm những lựa chọn phân trang
  // page: trang sản phẩm hiện tại, limit: tối đa số lượng sản phẩm trên 1 trang,
  // order: sắp xếp theo "asc" hoặc "desc" (chỉ có 2 kiểu này)
  // sort: tùy chọn trường để sort với cú pháp {[key]: value}, ở đây để sort trong ngoặc vuông
  // Vì muốn lấy value của sort để làm key và lấy order làm value và có 2 lựa chọn là "asc" hoặc "desc"
  const options = {
    page: _page,
    limit: _limit,
    sort: {
      [_sort]: _order === "desc" ? 1 : -1,
    },
  };
  try {
    // SEARCH
    const searchData = (products) => {
      return products?.docs?.filter((item) =>
        item.product_name?.toLowerCase().includes(_keywords)
      );
    };
    // const query = {};
    // if (_keywords) {
    //   query.$text = { $search: _keywords };
    // }
    const products = await Product.paginate({}, options);

    if (!products.docs || products.docs.length === 0) {
      return res.status(400).json({
        message: "không tìm thấy sản phẩm",
      });
    }

    const searchDataProduct = await searchData(products);
    const productResponse = await { ...products, docs: searchDataProduct };
    // console.log(productResponse);

    return res.json({
      message: "Lấy sản phẩm thành công",
      // products: products,
      products: productResponse,
      pagination: {
        currentPage: products.page,
        totalPages: products.totalPages,
        totalItems: products.totalDocs,
      },
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    if (!products || products.length === 0) {
      return res.status(400).json({
        message: "không tìm thấy sản phẩm nào",
      });
    }

    return res.json({
      message: "Lấy danh sách sản phẩm thành công",
      products,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || product.length === 0) {
      return res.status(400).json({
        message: "không tìm thấy sản phẩm",
      });
    }

    // Tăng giá trị product_view_count lên 1
    product.product_view_count += 1;

    // Lưu sản phẩm đã được cập nhật
    await product.save();

    return res.json({
      message: "Lấy sản phẩm thành công",
      product,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const getProductBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const product = await Product.findOne({ slug });
    if (!product || product.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm",
      });
    }
    // Tăng giá trị product_view_count lên 1
    product.product_view_count += 1;

    // Lưu sản phẩm đã được cập nhật
    await product.save();

    return res.status(200).json({
      message: "Lấy sản phẩm thành công",
      product,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const createProduct = async (req, res) => {
  const formData = req.body;
  const { product_name } = req.body;
  try {
    // name = name.trim();
    // description = description.trim();

    // Kiểm tra xem sản phẩm đã tồn tại hay chưa
    const data = await Product.findOne({ product_name });
    if (data) {
      return res.status(400).json({
        message: "Sản phẩm đã tồn tại",
      });
    }
    // Validate các trường dữ liệu trước khi thêm mới sản phẩm
    const checkname = await Product.findOne({ product_name });
    if (checkname) {
      return res.status(400).json({
        message: "Sản phẩm đã tồn tại",
      });
    }

    const { error } = await ProductSchema.validate(formData, {
      abortEarly: false,
    });

    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }

    const product = await Product.create(formData);

    // sau khi thêm sản phẩm xong, push luôn _id của sản phẩm đó vào mảng "products" của danh mục tương ứng
    await Category.findByIdAndUpdate(product.categoryId, {
      $addToSet: { products: product._id },
    });
    if (!product || product.length === 0) {
      return res.status(400).json({
        message: "không tìm thấy sản phẩm",
      });
    }
    return res.json({
      message: "Thêm sản phẩm thành công",
      product,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const formData = req.body;
  const { categoryId } = req.body;
  try {
    // name = name.trim();
    // description = description.trim();

    // VALIDATE
    const { error } = ProductSchema.validate(formData, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    // Kiểm tra xem sản phẩm có tồn tại không
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại!" });
    }

    // Kiểm tra xem danh mục mới có tồn tại không
    const newCategory = await Category.findById(categoryId);
    if (!newCategory) {
      return res.status(404).json({ error: "Danh mục không tồn tại!" });
    }

    // Kiểm tra xem sản phẩm đã thuộc danh mục cũ hay chưa
    const oldCategory = await Category.findById(product.categoryId);

    // Nếu sản phẩm thuộc danh mục cũ, di chuyển id sản phẩm sang danh mục mới
    if (oldCategory) {
      // Xóa id sản phẩm khỏi danh mục cũ
      oldCategory.products.pull(id);
      await oldCategory.save();

      //Thêm id sản phẩm vào danh mục mới
      newCategory.products.push(id);
      await newCategory.save();
    }

    // Update product
    const productUpdate = await Product.findByIdAndUpdate(
      id,
      { ...formData, categoryId },
      {
        new: true,
      }
    );

    if (!productUpdate || productUpdate.length === 0) {
      return res.status(400).json({
        message: "không tìm thấy sản phẩm",
      });
    }
    return res.json({
      message: "Cập nhật sản phẩm thành công",
      productUpdate,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const removeProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm sản phẩm cần xóa
    const product = await Product.findById(id);
    if (!product) {
      return res.status(400).json({
        message: "Không thể tìm thấy sản phẩm cần xóa!",
      });
    }

    // Tìm danh mục tương ứng với category của sản phẩm
    const category = await Category.findById(product.categoryId);
    if (!category) {
      return res.status(400).json({
        message: "Category does not exist!",
      });
    }

    if (category) {
      // Xóa id sản phẩm khỏi mảng products của danh mục
      category.products.pull(id);
      await category.save();
    }

    // const product = await Product.findByIdAndDelete(req.params.id);
    // Xóa sản phẩm
    await Product.findByIdAndDelete(id);

    if (!product || product.length === 0) {
      return res.status(400).json({
        message: "không tìm thấy sản phẩm",
      });
    }
    return res.json({
      message: "Xóa sản phẩm thành công",
      product,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

// export const getProductByCategory = async (req, res) => {
// try {
//   const id = req.params.id;
//   const products = await Product.find({ categoryId: id });
//   if (!products)
//     return res.status(404).json({
//       message: "Không tìm thấy sản phấm chứa danh mục này!",
//       success: false,
//     });

//   const productResponse = await { docs: products };
//   return res.status(200).json({
//     message: "Oke nè!",
//     success: true,
//     productResponse,
//     pagination: {
//       currentPage: products.page,
//       totalPages: products.totalPages,
//       totalItems: products.totalDocs,
//     },
//   });
// } catch (error) {
//   return res.status(400).json({
//     success: false,
//     mes: error?.message,
//   });
// }
// };

export const getProductByCategorySearch = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const products = await Category.findById(categoryId).populate("products");

    if (!products) {
      return res.status(400).json({
        message: "Không tìm thấy danh mục",
      });
    }
    const productResponse = await { docs: products.products };
    return res.json({
      message: "Lấy danh sách sản phẩm theo danh mục thành công",
      productResponse,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const getProductByCategoryId = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId).populate("products");

    if (!category) {
      return res.status(400).json({
        message: "Không tìm thấy danh mục",
      });
    }

    const products = category;
    return res.json({
      message: "Lấy danh sách sản phẩm theo danh mục thành công",
      products,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
