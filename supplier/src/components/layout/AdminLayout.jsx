import { useEffect } from 'react';
import Header from './admin/Header.jsx';
import { userDetailsAtom } from '../../storges/user.js';
import { useAtom } from 'jotai';
import axiosInstance from '../../axios.js';
import Sidebar from './admin/Sidebar.jsx';

const InnerLayout = () => {
  const [, setUserDetails] = useAtom(userDetailsAtom);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('authAccessToken');
    async function fetchProfileData() {
      try {
        const res = await axiosInstance.get(
          `/proxy/productsearchsupplier/api/supplier/profile/supplierProfileDetails?supplierUserId=${user?.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserDetails(res.data);
      } catch (e) {
        console.log(e);
      }
    }

    if (user?.id) {
      fetchProfileData();
    }
  }, []);

  return (
    <>
      <Header />
      <Sidebar />
    </>
  );
};

export default InnerLayout;
