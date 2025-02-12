import { useEffect } from 'react';
import Header from './components/layout/Header.jsx';
import { Outlet } from 'react-router-dom';
import { userDetailsAtom } from './storges/user.js';
import { useAtom } from 'jotai';
// import axiosInstance from './axios.js';
// import axios from 'axios';

const Layout = () => {
  const [, setUserDetails] = useAtom(userDetailsAtom);
  // const [, setBussinessProfile] = useAtom(bussinessProfile);

  // const [, setRoles] = useAtom(roles);

  // const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    // const token = localStorage.getItem('authAccessToken');
    // async function fetchProfileData() {
    //   try {
    //     const res = await axiosInstance.get(
    //       `/proxy/productsearchsupplier/api/supplier/profile/supplierProfileDetails?supplierUserId=${user?.supplierId}`,
    //       {
    //         headers: {
    //           Authorization: `Bearer ${token}`,
    //         },
    //       }
    //     );
    //     setUserDetails(res.data);
    //   } catch (e) {
    //     console.log(e);
    //   }
    // }
    // async function fetchBussinessProfile() {
    //   try {
    //     const res = await axiosInstance.get(
    //       `/proxy/productsearchsupplier/api/supplier/file/supplierBusinessProfileDetails?supplierProfileId=${user?.supplierId}`
    //     );

    //     if (res.data.supplierBusinessDetails) {
    //       setBussinessProfile(res.data.supplierBusinessDetails);
    //     }
    //   } catch (e) {
    //     console.log(e);
    //   }
    // }

    // async function fetchRolesData() {
    //   try {
    //     const res = await axiosInstance.get(
    //       `/proxy/productsearchsupplier/role/getAllRoles`,
    //       {
    //         headers: {
    //           Authorization: `Bearer ${token}`,
    //         },
    //       }
    //     );

    //     // console.log('res.data', res.data);
    //     setRoles(res.data);
    //   } catch (e) {
    //     console.log(e);
    //   }
    // }

    // const loadPremises = async () => {
    //   try {
    //     const res = await axios.post(
    //       '/proxy/productsearchsupplier/premisesListing'
    //     );
    //     console.log(res);
    //   } catch (e) {
    //     console.log(e);
    //   }
    // };

    if (user) {
      console.log('user', user);
      // if (user.userType === 'Supplier') {
      //   fetchProfileData();
      //   fetchBussinessProfile();
      // } else if (user.userType === 'Admin') {
      //   navigate('/admin');
      // } else
      if (user.userType === 'User') {
        setUserDetails({
          ...user,
          id: user.userId,
          supplierName: user.userName,
        });
        // navigate('/user');
      }
    }
    // loadPremises();
  }, []);

  return (
    <>
      <Header />
      <div>
        <Outlet />
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default Layout;
