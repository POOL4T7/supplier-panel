import { useEffect } from 'react';
import Header from './supplier/Header.jsx';
import {
  bussinessProfile,
  roles,
  userDetailsAtom,
} from '../../storges/user.js';
import { useAtom } from 'jotai';
import axiosInstance from '../../axios.js';
import Sidebar from './supplier/Sidebar.jsx';
import { useNavigate } from 'react-router-dom';

const SupplierLayout = () => {
  const [, setUserDetails] = useAtom(userDetailsAtom);
  const [, setBussinessProfile] = useAtom(bussinessProfile);

  const [, setRoles] = useAtom(roles);

  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('authAccessToken');
    async function fetchProfileData() {
      try {
        const res = await axiosInstance.get(
          `/proxy/productsearchsupplier/api/supplier/profile/supplierProfileDetails?supplierUserId=${user?.supplierId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserDetails({
          id: user.supplierId,
          ...res.data,
          status: res?.data?.active,
        });
      } catch (e) {
        console.log(e);
      }
    }
    async function fetchBussinessProfile() {
      try {
        const res = await axiosInstance.get(
          `/proxy/productsearchsupplier/api/supplier/file/supplierBusinessProfileDetails?supplierProfileId=${user?.supplierId}`
        );

        if (res.data.supplierBusinessDetails) {
          setBussinessProfile(res.data.supplierBusinessDetails);
        }
      } catch (e) {
        console.log(e);
      }
    }

    async function fetchRolesData() {
      try {
        const res = await axiosInstance.get(
          `/proxy/productsearchsupplier/role/getAllRoles`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // console.log('res.data', res.data);
        setRoles(res.data);
      } catch (e) {
        console.log(e);
      }
    }

    if (user) {
      if (user.supplierId) {
        fetchProfileData();
        fetchBussinessProfile();
      } else {
        navigate('/admin');
      }
    }
    fetchRolesData();
  }, []);

  return (
    <>
      <Header />
      <Sidebar />
    </>
  );
};

export default SupplierLayout;
