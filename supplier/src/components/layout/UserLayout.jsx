import { useEffect } from 'react';
import Header from './user/Header.jsx';
import { userDetailsAtom } from '../../storges/user.js';
import { useAtom } from 'jotai';
import axiosInstance from '../../axios.js';
// import Sidebar from './user/Sidebar.jsx';
import { Outlet, useNavigate } from 'react-router-dom';

const SupplierLayout = () => {
  const [, setUserDetails] = useAtom(userDetailsAtom);

  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('authAccessToken');
    async function fetchProfileData() {
      try {
        const res = await axiosInstance.get(
          `/proxy/productsearchsupplier/api/userProfile/getUserProfileDetails?userProfileId=${user?.userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log('res', res);
        setUserDetails({ ...res.data, status: res?.data?.isActive });
      } catch (e) {
        console.log(e);
      }
    }

    if (user) {
      if (user.userType === 'User') {
        // setUserDetails({
        //   userName: 'gulsh',
        // });
        fetchProfileData();
      } else {
        navigate('/user');
      }
    }
  }, []);

  return (
    <>
      <Header />
      <Outlet />
      {/* <Sidebar /> */}
    </>
  );
};

export default SupplierLayout;
