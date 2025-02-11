import { createBrowserRouter } from 'react-router-dom';
import Signin from './pages/Signin';
import Layout from './Layout';
import LandingPage from './pages/LandingPage';
import Signup from './pages/Signup';
import SignupCompletion from './pages/SignupCompletion';
// import Admin from './pages/admin/AdminProfile';
// import SupplierList from './pages/admin/SupplierList';
// import AdminLayout from './components/layout/AdminLayout';
// import SupplierLayout from './components/layout/SupplierLayout';
// import ProductCategory from './pages/supplier/product/Category';
// import ProductSubCategory from './pages/supplier/product/SubCategory';
// import ProductListPage from './pages/supplier/product/ProductListPage';
// import BussinessProfile from './pages/supplier/BussinessProfile';
// import SupplierSubCategory from './pages/supplier/services/SubCategory';
// import SupplierCategory from './pages/supplier/services/Category';
// import ServiceListPage from './pages/supplier/services/ServiceListPage';
// import SuppilerProfile from './pages/supplier/Profile';
import UserSupplierProfile from './pages/UserSupplierProfile';
// import ResetPassword from './pages/supplier/auth/ResetPassword';
import ForgotPassword from './pages/auth/ForgotPassword';
import ChangePassword from './pages/auth/ChangePassword';
import UserLayout from './components/layout/UserLayout';
import UserProfile from './pages/user/Profile';
import SupplierDetails from './pages/supplier/SupplierDetails';
import SearchResult from './pages/SearchResult';

// import BussinessProfile from './pages/supplier/bussiness/Profile';
// import BussinessAddress from './pages/supplier/bussiness/Address';
// import BussinessContact from './pages/supplier/bussiness/Contact';
// import BussinessTaxProfile from './pages/supplier/bussiness/Tax';
// import BussinessVerify from './pages/supplier/bussiness/Verify';

// import ActivateAccount from './pages/supplier/ActivateAccount';

const router = () => {
  return createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: '/',
          element: <LandingPage />,
        },
        {
          path: '/user-supplier-profile',
          element: <UserSupplierProfile />,
        },
        {
          path: '/signin',
          element: <Signin />,
        },
        {
          path: '/register',
          element: <Signup />,
        },
        {
          path: '/register-completion',
          element: <SignupCompletion />,
        },
        {
          path: '/forgot-password',
          element: <ForgotPassword />,
        },
        {
          path: '/change-password',
          element: <ChangePassword />,
        },
        {
          path: '/supplier-details',
          element: <SupplierDetails />,
        },
        {
          path: '/search-result',
          element: <SearchResult />,
        },
      ],
    },
    // {
    //   path: '/admin',
    //   element: <AdminLayout />,
    //   children: [
    //     {
    //       path: 'profile',
    //       element: <Admin />,
    //     },
    //     {
    //       path: 'supplier-list',
    //       element: <SupplierList />,
    //     },
    //   ],
    // },
    // {
    //   path: '/supplier',
    //   element: <SupplierLayout />,
    //   children: [
    //     {
    //       path: 'profile',
    //       element: <SuppilerProfile />,
    //     },
    //     {
    //       path: 'product-category',
    //       element: <ProductCategory />,
    //     },
    //     {
    //       path: 'product-subcategory',
    //       element: <ProductSubCategory />,
    //     },
    //     {
    //       path: 'products',
    //       element: <ProductListPage />,
    //     },
    //     {
    //       path: 'bussiness',
    //       children: [
    //         {
    //           path: 'profile',
    //           element: <BussinessProfile />,
    //         },
    //         {
    //           path: 'address',
    //           element: <BussinessAddress />,
    //         },
    //         {
    //           path: 'contact',
    //           element: <BussinessContact />,
    //         },
    //         {
    //           path: 'tax-details',
    //           element: <BussinessTaxProfile />,
    //         },
    //         {
    //           path: 'verify',
    //           element: <BussinessVerify />,
    //         },
    //       ],
    //     },
    //     {
    //       path: 'service-category',
    //       element: <SupplierCategory />,
    //     },
    //     {
    //       path: 'service-subcategory',
    //       element: <SupplierSubCategory />,
    //     },
    //     {
    //       path: 'services',
    //       element: <ServiceListPage />,
    //     },
    //     {
    //       path: 'reset-password',
    //       element: <ResetPassword />,
    //     },
    //     {
    //       path: 'account-activation',
    //       element: <ActivateAccount />,
    //     },
    //   ],
    // },
    {
      path: '/user',
      element: <UserLayout />,
      children: [
        {
          path: 'user',
          element: <UserProfile />,
        },
        {
          path: 'profile',
          element: <UserProfile />,
        },
      ],
    },
  ]);
};

export default router;

// router.propTypes = {
//   isAuth: PropTypes.bool,
//   status: PropTypes.string,
// };
