import { Routes, Route } from "react-router-dom";
import "./index.css";
// COMPONENTS
import HomePage from './pages/home/HomePage';
import ProductList from './pages/admin/Product/ProductList';
import ProductDetail from './pages/productDetail/ProductDetail';
import DashBoard from './pages/admin/DashBoard';
import ProductPage from './pages/product/ProductPage';
import ProductUpdate from './pages/admin/Product/ProductUpdate';
import ProductAdd from './pages/admin/Product/ProductAdd';
import CategoryList from './pages/admin/Category/CategoryList';
import CategoryUpdate from './pages/admin/Category/CategoryUpdate';
import CategoryAdd from './pages/admin/Category/CategoryAdd';
import NotFoundPage from './pages/notFoundPage/NotFoundPage';
import AboutPage from "./pages/about/AboutPage";
import ContactPage from "./pages/contactPage/ContactPage";
import ClientLayout from "./layout/Client/ClientLayout";
import AdminLayout from "./layout/Admin/AdminLayout";

import UserList from "./pages/admin/User/UserList";
import UserUpdate from "./pages/admin/User/UserUpdate";
import CartPage from "./pages/cart/CartPage";
import { ForgetPassword } from "./api/User";

import Signin from "./pages/auth/Signin/Signin";
import Signup from "./pages/auth/Signup/Signup";
import ForgetPasswordPage from "./pages/auth/ForgetPassword";
import ChangePassword from "./pages/auth/ChangePassword";
import BillUpdate from "./pages/admin/Bill/BillUpdate";
import RoleList from "./pages/admin/Role/RoleList";
import RoleUpdate from "./pages/admin/Role/RoleUpdate";
import RoleAdd from "./pages/admin/Role/RoleAdd";
import UserAdd from "./pages/admin/User/UserAdd";
import BinProduct from "./pages/admin/Product/components/Bin";
import VerifyAccount from "./pages/auth/VerifyAccount/VerifyAccount";
import AccountPage from "./pages/account/AccountPage";
import CheckoutPage from "./pages/checkout/CheckoutPage";
// import { UploadFileImages } from "./api/Upload";
// import { UploadImageUpdate } from "./api/Upload";
import BillList from './pages/admin/Bill/BillList';
import BillListPage from "./pages/account/components/bill/BillList";
import BillDetailpage from "./pages/account/components/bill/BillDetail";
import InfoUser from "./pages/account/components/Info";
import ListReviews from "./pages/account/components/ListReviews";

function App() {
  const onHandleForgetPassword = async (email: string) => {
    try {
      const { data } = await ForgetPassword(email);
      // message.info(`${data.message}`);
      // if (data) {
      //   message.success(data.message)
      // } else {
      //   message.error(data.message)
      // }
      console.log(data);
    } catch (error: any) {
      // message.error(error.response.data)
      console.log(error);
    }
  }
  return (
    <>
      <div>
        <Routes>
          <Route path='/' element={<ClientLayout />}>
            <Route index element={<HomePage />} />
            <Route path='products'>
              <Route index element={<ProductPage />} />
              <Route path=':slug' element={<ProductDetail />} />
            </Route>
            <Route path="product/:slug" element={<ProductDetail />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />

            <Route path='signin' element={<Signin />} />
            <Route path='signup' element={<Signup />} />
            <Route path='verify' element={<VerifyAccount />} />
            <Route path='/forget-password' element={<ForgetPasswordPage onForgetPass={onHandleForgetPassword} />} />
            <Route path='/change-password' element={<ChangePassword />} />
            <Route path='/account' element={<AccountPage />}>
              <Route index element={<InfoUser />} />
              <Route path="info" element={<InfoUser />} />
              <Route path="reviews" element={<ListReviews />} />
              <Route path='bills'>
                <Route index element={<BillListPage />} />
                <Route path=':id' element={<BillDetailpage />} />
              </Route>
            </Route>

            <Route path='/checkouts' element={<CheckoutPage />} />
            {/* <Route path='/bills/detail' element={<BillDetail />} /> */}
            <Route path='/cart' element={<CartPage />} />
            <Route path='*' element={<NotFoundPage />} />
          </Route>

          <Route path='admin' element={<AdminLayout />}>
            <Route index element={<DashBoard />} />
            <Route path='products'>
              <Route index element={<ProductList />} />
              <Route path=':id/update' element={<ProductUpdate />} />
              <Route path='add' element={<ProductAdd />} />
              <Route path='bin' element={<BinProduct />} />
            </Route>
            <Route path='categories'>
              <Route index element={<CategoryList />} />
              <Route path=':id/update' element={<CategoryUpdate />} />
              <Route path='add' element={<CategoryAdd />} />
            </Route>
            <Route path='users'>
              <Route index element={<UserList />} />
              <Route path='add' element={<UserAdd />} />
              <Route path=':id/update' element={<UserUpdate />} />
            </Route>
            <Route path='roles'>
              <Route index element={<RoleList />} />
              <Route path=':id/update' element={<RoleUpdate />} />
              <Route path='add' element={<RoleAdd />} />
            </Route>
            <Route path='bills'>
              <Route index element={<BillList />} />
              <Route path=':id/update' element={<BillUpdate />} />
            </Route>
          </Route>

        </Routes>
      </div>
    </>
  )
}

export default App
