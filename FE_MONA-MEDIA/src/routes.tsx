import { Navigate, createBrowserRouter } from "react-router-dom";
import ClientLayout from "./layout/Client/ClientLayout";
import HomePage from "./pages/home/HomePage";
import ProductPage from "./pages/product/ProductPage";
import CartPage from "./pages/cart/CartPage";
import BillPage from "./pages/checkout/CheckoutPage";
import ForgetPasswordPage from "./pages/auth/ForgetPassword";
import Signup from "./pages/auth/Signup/Signup";
import Signin from "./pages/auth/Signin/Signin";
import AdminLayout from "./layout/Admin/AdminLayout";
import DashBoard from "./pages/admin/DashBoard";
import ProductList from "./pages/admin/Product/ProductList";
import ProductAdd from "./pages/admin/Product/ProductAdd";
import CategoryList from "./pages/admin/Category/CategoryList";
import CategoryAdd from "./pages/admin/Category/CategoryAdd";
import CategoryUpdate from "./pages/admin/Category/CategoryUpdate";
import UserList from "./pages/admin/User/UserList";
import NotFoundPage from "./pages/notFoundPage/NotFoundPage";
import RoleList from "./pages/admin/Role/RoleList";
import RoleAdd from "./pages/admin/Role/RoleAdd";
import RoleUpdate from "./pages/admin/Role/RoleUpdate";
import UserAdd from "./pages/admin/User/UserAdd";
import UserUpdate from "./pages/admin/User/UserUpdate";
import BinProduct from "./pages/admin/Product/components/Bin";

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <ClientLayout />,
        children: [
            { index: true, element: <HomePage /> },
            {
                path: "products",
                children: [
                    { index: true, element: <ProductPage /> },
                    //   { path: ":id", element: <ProductDetailPage /> },
                ],
            },
            {
                path: "carts",
                children: [{
                    index: true, element: <CartPage />
                }],
            },
            {
                path: "checkouts",
                children: [{
                    index: true, element: <BillPage />
                }],
            },
            // {
            //     path: "account",
            //     element: <AccountPage />,
            //     children: [
            //         { index: true, element: <Navigate to="info" /> },
            //         { path: "dashboard", element: <DashboardAccount /> },
            //         { path: "forget-password", element: <ForgetPassword /> },
            //         { path: "change-password-new", element: <ChangePasswordNew /> },
            //         { path: "verify-token", element: <VerifyToken /> },
            //         { path: "change-password-forget", element: <VerifyToken /> },
            //         {
            //             path: "bills",
            //             children: [
            //                 { index: true, element: <DashboardBill /> },
            //                 { path: ":idBill", element: <BillDetail /> },
            //             ],
            //         },
            //         { path: "favorites", element: <Favorite /> },
            //         { path: "vouchers", element: <VoucherPage /> },
            //         { path: "reviews", element: <ListReviews /> },
            //         {
            //             path: "info",
            //             children: [
            //                 { index: true, element: <InfoUser /> },
            //                 {
            //                     path: "changPassword", element: <h2>ChanglePassWord < /h2> },
            //                         ],
            //             },
            //                         ],
            //     },
            {
                path: "forget-password",
                children: [{
                    index: true, element: <ForgetPasswordPage />
                }],
            },
            //         {
            //             path: "verify-token",
            //             children: [{
            //                 index: true, element: <VerifyToken />
            //             }],
            //         },
            //         {
            //             path: "changepasswordforget",
            //             children: [{
            //                 index: true, element: <ChangePasswordForget />
            //             }],
            //         },
            //         {
            //             path: "changepasswordnew",
            //             children: [{
            //                 index: true, element: <ChangePasswordNew />
            //             }],
            //         },
            //         { path: "contact", element: <ContactPage /> },
            //         {
            //             path: "blog",
            //             children: [
            //                 { index: true, element: <BlogPage /> },
            //                 { path: ":id", element: <BlogDetailPage /> },
            //             ],
            //         },
            //         { path: "about", element: <AboutPage />, },
            //         { path: "search", element: <SearchPage />, },
            //         {
            //             path: "brands/:id", element: <ProductByBrand />,
            //         },
            //         { path: "categories/:id", element: <ProductByCategory /> },
            //     ],
            // },
        ]
    },
    {
        path: "register",
        children: [
            {
                index: true,
                element: <Signup />,
            },
        ],
    },
    {
        path: "login",
        element: <Signin />,
    },
    {
        path: "admin",
        children: [
            {
                element: <AdminLayout />,
                children: [
                    { index: true, element: <Navigate to="dashboard" /> },
                    { path: "dashboard", element: <DashBoard /> },
                    {
                        path: "products",
                        children: [
                            { index: true, element: <ProductList /> },
                            { path: "add", element: <ProductAdd /> },
                            { path: "bin", element: <BinProduct /> },
                            // { path: "listDelete", element: <ListProductDelete /> },
                            // { path: ":id/update", element: <ProductUpdate /> },
                            // { path: ":id/variant/add", element: <VariantProductAdd /> },
                            // {
                            //     path: ":id/variant/:variantID/update",
                            //     element: <VariantProductUpdate />,
                            // },
                        ],
                    },
                    {
                        path: "categories",
                        children: [
                            { index: true, element: <CategoryList /> },
                            { path: "add", element: <CategoryAdd /> },
                            { path: ":id/update", element: <CategoryUpdate /> },
                        ],
                    },
                    {
                        path: "users",
                        children: [
                            { index: true, element: <UserList /> },
                            { path: "add", element: <UserAdd /> },
                            { path: ":id/update", element: <UserUpdate /> },
                        ],
                    },
                    {
                        path: "roles",
                        children: [
                            { index: true, element: <RoleList /> },
                            { path: "add", element: <RoleAdd /> },
                            { path: ":id/update", element: <RoleUpdate /> },
                        ],
                    },
                    // {
                    //     path: "news",
                    //     children: [
                    //         { index: true, element: <NewsList /> },
                    //         { path: "add", element: <NewsAdd /> },
                    //         { path: ":id/update", element: <NewsUpdate /> },
                    //     ],
                    // },
                    // {
                    //     path: "coupons",
                    //     children: [
                    //         { index: true, element: <CouponList /> },
                    //         { path: "add", element: <CouponAdd /> },
                    //         { path: ":id/update", element: <CouponUpdate /> },
                    //     ],
                    // },
                    // {
                    //     path: "colors",
                    //     children: [
                    //         { index: true, element: <ColorList /> },
                    //         { path: "add", element: <ColorAdd /> },
                    //         { path: ":id/update", element: <ColorUpdate /> },
                    //     ],
                    // },
                    // {
                    //     path: "sizes",
                    //     children: [
                    //         { index: true, element: <SizeList /> },
                    //         { path: "add", element: <SizeAdd /> },
                    //         { path: ":id/update", element: <SizeUpdate /> },
                    //     ],
                    // },

                    // {
                    //     path: "product-group",
                    //     children: [
                    //         { index: true, element: <ListGroup /> },
                    //         { path: "add", element: <AddGroup /> },
                    //         { path: ":id/update", element: <UpdateGroup /> },
                    //     ],
                    // },
                    // {
                    //     path: "banners",
                    //     children: [
                    //         { index: true, element: <BannerList /> },
                    //         { path: ":id/update", element: <BannerUpdate /> },
                    //     ],
                    // },
                    // {
                    //     path: "bills",
                    //     children: [
                    //         { index: true, element: <BillList /> },
                    //         { path: ":id/update", element: <BillUpdate /> },
                    //     ],
                    // },
                    // { path: "reviews", element: <ReviewList /> },
                    // { path: "statistics", element: <Statistic /> },
                ],
            },
        ],
    },
    { path: "*", element: <NotFoundPage /> },
])