import Category from "../models/category.js";
import Product from "../models/product.js";
import { categorySchema, categoryUpdateSchema } from "../schema/category.js";
import slugify from "slugify";
export const getAllCategory = async (req, res) => {
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
    // search
    const searchData = (categories) => {
      return categories?.docs?.filter((item) =>
        item.category_name?.toLowerCase().includes(_keywords)
      );
    };
    // const query = {};
    // if (_keywords) {
    //   query.$text = { $search: _keywords };
    // }

    const categories = await Category.paginate({}, options);
    if (!categories.docs || categories.docs.length === 0) {
      return res.status(400).json({
        message: "không tìm thấy danh mục",
      });
    }

    const searchDataCategory = await searchData(categories);
    const categoryResponse = await { ...categories, docs: searchDataCategory };
    // console.log(categoryResponse);

    return res.json({
      message: "Lấy danh mục thành công",
      // categories,
      categories: categoryResponse,
      pagination: {
        currentPage: categories.page,
        totalPages: categories.totalPages,
        totalItems: categories.totalDocs,
      },
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const getOneCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category || category.length === 0) {
      return res.status(400).json({
        message: "không tìm thấy danh mục",
      });
    }
    return res.json({
      message: "Lấy danh mục thành công",
      category,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const getCategoryBySlug = async (req, res) => {
  const slug = req.params.slug;
  try {
    const data = await Category.findOne({ slug });
    if (!data) {
      return res.status(404).json({
        message: "Không tìm thấy danh mục",
      });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json({ success: false, message: error });
  }
};

export const createCategory = async (req, res) => {
  const formData = req.body;
  const { category_name } = req.body;
  try {
    const checkname = await Category.findOne({ category_name });
    if (checkname) {
      return res.status(400).json({
        message: "Danh mục đã tồn tại",
      });
    }
    const { error } = categorySchema.validate(formData, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: error.details.map((error) => error.message),
      });
    }
    const category = await Category.create(formData);
    if (!category || category.length === 0) {
      return res.status(400).json({
        message: "không tìm thấy danh mục",
      });
    }
    return res.json({
      message: "Thêm danh mục thành công",
      category,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  const id = req.params.id;
  const { category_name } = req.body;
  const formData = req.body;
  try {
    const { error } = categoryUpdateSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        message: error.details.map((error) => error.message),
      });
    }

    const newSlug = slugify(category_name, { lower: true });

    const category = await Category.findByIdAndUpdate(
      id,
      { ...formData, slug: newSlug },
      {
        new: true,
      }
    );
    if (!category || category.length === 0) {
      return res.status(400).json({
        message: "không tìm thấy danh mục",
      });
    }
    return res.json({
      message: "Cập nhật danh mục thành công",
      category,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const removeCategory = async (req, res) => {
  const { id } = req.params;
  try {
    // Kiểm tra xem category có tồn tại hay không
    const category = await Category.findOne({ _id: id });
    if (!category) {
      return res.status(400).json({
        message: "Danh mục không tồn tại!",
      });
    }

    // Tìm và chuyển các sản phẩm liên quan sang danh mục "uncategorized"
    // const productsToUpdate = await Product.find({ categoryId: id });

    // // Tìm xem đã có danh mục Uncategorized trong db chưa
    // const uncategorizedCategory = await Category.findOne({
    //   name: "Uncategorized",
    // });
    // cập nhật categoryId của các sản phẩm thuộc category đang chuẩn bị được xóa sang id của "Uncategorized"
    // if (uncategorizedCategory) {
    //   await Product.updateMany(
    //     { categoryId: id },
    //     { categoryId: uncategorizedCategory._id }
    //   );

    //   // Cập nhật mảng products của danh mục "uncategorized"
    //   await Category.findByIdAndUpdate(
    //     { _id: uncategorizedCategory._id },
    //     {
    //       $push: {
    //         products: {
    //           $each: productsToUpdate.map((product) => product._id),
    //         },
    //       },
    //     }
    //   );
    // } else {
    //   const newUncategorizedCategory = await Category.create({
    //     name: "Uncategorized",
    //   });
    //   await Product.updateMany(
    //     { categoryId: id },
    //     { categoryId: newUncategorizedCategory._id }
    //   );

    //   // Cập nhật mảng products của danh mục "uncategorized"
    //   await Category.findByIdAndUpdate(
    //     { _id: newUncategorizedCategory._id },
    //     {
    //       $push: {
    //         products: {
    //           $each: productsToUpdate.map((product) => product._id),
    //         },
    //       },
    //     }
    //   );
    // }

    // const category = await Category.findByIdAndDelete(id);

    // await Product.findByIdAndUpdate(
    //   { categoryId: id },
    //   { $unset: { categoryId: "" } }
    // );

    // await Product.findByIdAndDelete(category.products, {
    //   $pull: [{ categoryId: category._id }],
    // });

    // XÓA DANH MỤC SẢN PHẨM
    await Category.findByIdAndDelete(id);

    for (const product of category.products) {
      await Product.findByIdAndDelete(product._id);
    }

    //  Xóa tất cả sản phẩm thuộc danh mục
    await Product.deleteMany({
      _id: { $in: category.products.map((product) => product._id) },
    });

    if (!category || category.length === 0) {
      return res.status(400).json({
        message: "không tìm thấy danh mục",
      });
    }
    return res.json({
      message: "Xóa danh mục thành công",
      category,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
