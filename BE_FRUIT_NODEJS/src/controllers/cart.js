// import Product from "../models/product";
// import User from "../models/user";
// import Cart from "../models/cart";

// export const getCarts = (req, res) => {
//   try {
//     const carts = Cart.find({});

//     // Nếu không tìm thấy giỏ hàng, trả về lỗi
//     if (carts.length === 0) {
//       return res.status(400).json({ message: "Không tìm thấy đơn hàng nào!" });
//     }
//     return res.status(200).json({ message: "Lấy đơn hàng thành công" });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };
// // GET ONE CART
// export const getCart = async (req, res) => {
//   const { userId } = req.params;

//   try {
//     // Tìm kiếm giỏ hàng của người dùng
//     let cart = await Cart.findOne({ userId })
//       .populate("products.productId")
//       .populate("userId");

//     // Nếu không tìm thấy giỏ hàng, trả về lỗi
//     if (!cart) {
//       return res.status(400).json({ message: "không tìm thấy đơn hàng!" });
//     }
//     // Tính tổng giá của giỏ hàng
//     handleTotalOrder(cart);

//     return res.status(200).json({
//       message: "Lấy đơn hàng thành công!",
//       cart,
//     });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

// export const addToCart = async (req, res) => {
//   const { userId, quantity = 1, productId } = req.body;
//   const formData = req.body;
//   try {
//     // Kiểm tra xem user đang thực hiện chức năng đã có giỏ hàng chưa
//     const cart = await Cart.findOne({ userId: userId });

//     if (!cart) {
//       await Cart.create({
//         userId: userId,
//         products: [],
//         shippingFee: 10,
//         coupon: "MONA_DMN2003",
//       });

//       // Cập nhật id của Cart trong collection User
//       await User.findByIdAndUpdate(userId, { cartId: cart._id });
//     }
//     // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
//     const productExists = cart.products.find(
//       (product) => product.productId == productId
//     );
//     if (!productExists) {
//       // Sản phẩm chưa tồn tại trong giỏ hàng, thêm mới
//       const product = await Product.findById(productId);
//       cart.products.push({
//         productId: product._id,
//         quantity: quantity,
//         price: product.price * quantity,
//       });
//     } else {
//       // Sản phẩm đã tồn tại trong giỏ hàng, chỉ cần cập nhật số lượng và giá
//       if (quantity === 1) {
//         productExists.quantity++;
//       } else {
//         productExists.quantity += quantity;
//       }
//       const getPriceProduct = await Product.findById(productId).select("price");
//       productExists.price = getPriceProduct.price * productExists.quantity;
//     }
//     await cart.save();
//     handleTotalOrder(cart);
//     return res
//       .status(200)
//       .json({ message: "Sản phẩm đã được thêm vào giỏ hàng", cart });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };
// // hàm để tính tổng giá sản phẩm trong giỏ hàng
// const handleTotalOrder = async (cart) => {
//   try {
//     // Tính tổng giá của giỏ hàng
//     const total = cart.products.reduce((accumulator, product) => {
//       return accumulator + product.price;
//     }, 0);

//     cart.totalPrice = total;
//     cart.totalOrder = cart.totalPrice + cart.shippingFee;
//     await cart.save();
//     return cart;
//   } catch (error) {
//     return res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// export const updateCart = async (req, res) => {
//   const { userId, productId, quantity } = req.body;
//   try {
//     // Kiểm tra xem user đang thực hiện chức năng đã có giỏ hàng chưa
//     const cart = await Cart.findOne({ userId: userId });

//     // Nếu không tìm thấy giỏ hàng, trả về lỗi
//     if (!cart) {
//       return res.status(400).json({ message: "Không tìm thấy giỏ hàng!" });
//     }
//     // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
//     const product = cart.products.find((product) =>
//       product.productId.equals(productId)
//     );
//     // Nếu không tìm thấy sản phẩm trong giỏ hàng, trả về lỗi
//     if (!product) {
//       return res
//         .status(400)
//         .json({ message: "Không tìm thấy sản phẩm trong giỏ hàng!" });
//     }

//     // Cập nhật số lượng sản phẩm
//     product.quantity = quantity;

//     // Cập nhật lại giá sản phẩm theo số lượng
//     const getPriceProduct = await Product.findById(productId).select("price");
//     product.price = getPriceProduct.price * quantity;

//     await cart.save();

//     // Tính tổng giá của giỏ hàng
//     handleTotalOrder(cart);

//     return res
//       .status(200)
//       .json({ message: "Giỏ hàng đã được sửa đổi thành công!" });
//   } catch (error) {
//     return res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// export const deleteProductCart = async (req, res) => {
//   const { userId, productId } = req.body;
//   try {
//     // Tìm kiếm giỏ hàng của người dùng
//     let cart = await Cart.findOne({ userId: userId });

//     // Nếu không tìm thấy giỏ hàng, trả về lỗi
//     if (!cart) {
//       return res.status(400).json({ message: "Không tìm thấy đơn hàng!" });
//     }

//     // Tạo một mảng mới chỉ chứa những sản phẩm không trùng với sản phẩm cần xóa
//     cart.products = cart.products.filter(
//       (product) => product.productId != productId
//     );

//     await cart.save();

//     // Tính tổng giá của giỏ hàng
//     handleTotalOrder(cart);

//     return res
//       .status(200)
//       .json({ message: "Xóa sản phẩm trong giỏ hàng thành công!" });
//   } catch (error) {
//     return res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// export const deleleAllProductCart = async (req, res) => {
//   const { userId } = req.body;
//   try {
//     // Tìm kiếm giỏ hàng của người dùng
//     const cart = await Cart.findOne({ userId: userId });

//     // Nếu không tìm thấy giỏ hàng, trả về lỗi
//     if (!cart) {
//       return res.status(400).json({
//         message: "Không tìm thấy giỏ hàng!",
//       });
//     }

//     // Tìm thấy, xóa tất cả sản phẩm trong giỏ hàng
//     cart.products = [];
//     await cart.save();
//     return res
//       .status(200)
//       .json({ message: "Xóa tất cả sản phẩm trong giỏ hàng thành công!" });
//   } catch (error) {
//     return res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// // export const checkOut = async (req, res) => {
// //   const { userId, shippingAddress, paymentMethod, orderNotes } = req.body;
// //   try {
// //     // Tìm kiếm giỏ hàng của người dùng
// //     const cart = await Cart.findOne({ userId: userId }).populate(
// //       "products.productId"
// //     );

// //     // Nếu không tìm thấy giỏ hàng, trả về lỗi
// //     if (!cart || cart.products.length === 0) {
// //       return res.status(400).json({
// //         message:
// //           "Không tìm thấy giỏ hàng hoặc trong giỏ hàng không có sản phẩm nào!",
// //       });
// //     }

// //     // Lấy thông tin user
// //     const user = await User.findById(userId);

// //     // Tạo bill
// //     const bill = await Bill.create({
// //       userId: userId,
// //       cartId: cart._id,
// //       totalPrice: cart.totalPrice,
// //       shippingFee: cart.shippingFee,
// //       shippingAddress: user.address || shippingAddress,
// //       totalOrder: cart.totalOrder,
// //       paymentMethod: paymentMethod,
// //       orderNotes: orderNotes,
// //       products: cart.products,
// //     });

// //     // Sau khi đã tạo bill, cập nhật trạng thái giỏ hàng và xóa giỏ hàng
// //     cart.totalPrice = 0;
// //     cart.totalOrder = 0;
// //     cart.products = [];
// //     await cart.save();

// //     //Sau khi tạo bill xong, thêm luôn id của bill đó vào mảng bills của User
// //     user.bills.push({
// //       billId: bill._id,
// //     });

// //     await user.save();

// //     return res.status(200).json({ message: "Đặt hàng thành công!", bill });
// //   } catch (error) {
// //     return res.status(500).json({
// //       message: error.message,
// //     });
// //   }
// // };
import Cart from "../models/cart.js";
import User from "../models/user.js";
import Product from "../models/product.js";

export const addToCart = async (req, res) => {
  const { userId, productId, quantity = 1, size, color } = req.body;
  try {
    if (
      !userId ||
      !productId ||
      // !color ||
      // !size ||
      !quantity ||
      quantity <= 0
    ) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    }
    // Kiểm tra xem sản phẩm có tồn tại hay k thì mới được thêm sản phẩm vào giỏ hàng
    const exisUser = await User.findById(userId);
    if (!exisUser) {
      return res.status(400).json({ message: "Bạn chưa đăng nhập!" });
    }
    // Kiểm tra xem sản phẩm có tồn tại hay k thì mới được thêm sản phẩm vào giỏ hàng
    const existProduct = await Product.findById(productId);
    if (!existProduct) {
      return res.status(400).json({ message: "Sản phẩm không tồn tại!" });
    }
    // Kiểm tra xem sản phẩm có tồn tại hay k thì mới được thêm sản phẩm vào giỏ hàng
    const existQuantity = await Product.findById(productId);
    if (existQuantity?.product_quantity < quantity) {
      return res.status(400).json({
        message:
          "Số lượng bạn vừa nhập không đủ với số hàng trong kho shop đang có!",
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      await Cart.create({
        userId,
        products: [],
        shippingFee: 30000,
        coupon: "FS_DMN2003",
        totalOrder: 0,
      });

      // Cập nhật id của cart bên bảng User
      await User.findByIdAndUpdate(userId, { cartId: cart._id });
    }
    // // Check xem có sản phẩm trong giỏ hàng chưa
    const productExist = cart?.products?.find(
      (product) => product?.productId == productId
    );
    // // Nếu chưa có sản phẩm thì thêm mới
    if (!productExist) {
      const product = await Product.findById(productId);
      cart?.products?.push({
        productId: product?._id,
        quantity: quantity,
        price: product?.product_price,
        size: size,
        color: color,
      });
    } else {
      //   // Ngược lại nếu đã có sản phẩm trong giỏ hàng thì chỉ cập nhật số lượng
      if (quantity === 1) {
        productExist.quantity++;
      } else {
        productExist.quantity += quantity;
      }
      const getProductPrice = await Product.findById(productId).select(
        "product_price"
      );
      productExist.price =
        getProductPrice?.product_price * productExist?.quantity;
    }
    // const getProductPrice = await Product.findById(productId).select(
    //   "product_price"
    // );
    // cart.totalPrice = getProductPrice?.product_price * productExist?.quantity;

    await User.findByIdAndUpdate(userId, {
      cartId: cart._id,
    });

    await totalOrder(cart);
    // // Lưu giỏ hàng
    await cart.save();

    return res.status(200).json({
      message: "Sản phẩm đã được thêm vào giỏ hàng!",
      cart,
    });
    // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hàm tính tổng giá tất cả sản phẩm trong giỏ hàng
const totalOrder = async (cart) => {
  try {
    // Tính tổng giá của giỏ hàng
    const total = cart?.products?.reduce((accumulator, product) => {
      return accumulator + product.price;
    }, 0);

    cart.totalPrice = total;
    cart.totalOrder = cart.totalPrice + cart.shippingFee;
    await cart.save();
    return cart;
  } catch (error) {
    return error.message;
  }
};

export const updateCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    // Kiểm tra user đang thực hiện đã có giỏ hàng chưa
    const cart = await Cart.findOne({ userId });

    // Nếu không tìm thấy giỏ hàng, trả về lỗi
    if (!cart) {
      return res.status(400).json({ message: "Không tìm thấy giỏ hàng!" });
    }

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng hay chưa so sánh id trong giỏ hàng với productid gửi lên
    const product = cart.products.find(
      (product) => product.productId == productId
    );
    if (!product) {
      return res
        .status(400)
        .json({ message: "Không tìm thấy sản phẩm trong giỏ hàng!" });
    }
    // Cập nhật số lượng sản phẩm
    product.quantity = quantity;

    // Cập nhật lại giá sản phẩm theo số lượng
    const getProductPrice = await Product.findById(productId).select(
      "product_price"
    );
    product.price = getProductPrice.product_price * quantity;

    await cart.save();

    // Tính lại tổng đơn hàng cần thanh toán
    totalOrder(cart);

    // Sau khi thành công thì trả về
    return res
      .status(200)
      .json({ message: "Giỏ hàng đã được sửa đổi thành công!", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProductCart = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    // Tìm kiếm giỏ hàng của người dùng
    let cart = await Cart.findOne({ userId: userId });

    // Nếu không tìm thấy giỏ hàng, trả về lỗi
    if (!cart) {
      return res
        .status(400)
        .json({ message: "Không tìm thấy sản phẩm trong giỏ hàng!" });
    }

    // Tạo một mảng mới chỉ chứa những sản phẩm không trùng với sản phẩm cần xóa
    cart.products = cart.products.filter(
      (product) => product.productId != productId
    );

    await cart.save();

    // Tính tổng giá của giỏ hàng
    totalOrder(cart);

    res.status(200).json({ message: "Xóa sản phẩm thành công!", cart });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllCarts = async (req, res) => {
  try {
    const data = await Cart.find({});
    return res
      .status(200)
      .json({ message: "Lấy danh sách giỏ hàng thành công!", data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCartByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const data = await Cart.findOne({ userId })
      .populate(
        "products.productId",
        "product_name product_price product_discount product_images _id"
      )
      .populate("userId");

    if (!data) {
      return res.status(400).json({ message: "Không tìm thấy đơn hàng nào!" });
    }
    const totalProduct = data?.products.length;

    totalOrder(data);
    return res.status(200).json({
      message: "Lấy danh sách giỏ hàng thành công!",
      data,
      totalProduct,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCartById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Cart.findById(id).populate("products.productId");
    if (!data) {
      return res.status(400).json({ message: "Không tìm thấy đơn hàng nào!" });
    }
    const totalProduct = data?.products.length;

    totalOrder(data);
    return res.status(200).json({
      message: "Lấy danh sách giỏ hàng thành công!",
      data,
      totalProduct,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleleAllProductCart = async (req, res) => {
  const { userId } = req.params;
  try {
    // Tìm kiếm giỏ hàng của người dùng
    const cart = await Cart.findOne({ userId: userId });

    // Nếu không tìm thấy giỏ hàng, trả về lỗi
    if (!cart) {
      return res.status(400).json({
        message: "Không tìm thấy giỏ hàng!",
      });
    }

    // Tìm thấy, xóa tất cả sản phẩm trong giỏ hàng
    cart.products = [];
    await cart.save();
    return res.status(200).json({
      message: "Xóa tất cả sản phẩm trong giỏ hàng thành công!",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
