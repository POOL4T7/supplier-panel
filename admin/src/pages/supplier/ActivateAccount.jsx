import { useState } from 'react';
import FormContainer from '../../components/common/FormContainer';
import axiosInstance from '../../axios';
import { toast } from 'react-toastify';
import Spinner from '../../components/common/Spinner';

const ActivateAccount = () => {
  const [status, setStatus] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  console.log('status', status);
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      // delete data?.password;
      const formData = {
        // supplierName: data.supplierName,
        // gender: data.gender,
        // addressLine1: data.addressLine1,
        // addressLine2: data.addressLine2,
        // city: data.city,
        // zipcode: data.zipcode,
        // phoneNumber: data.phoneNumber,
        // email: data.email,
        // country: data.country,
        // supplierId: userDetails.id,
        status: Boolean(status),
      };
      const res = await axiosInstance.post(
        `/proxy/productsearchsupplier/api/supplier/profile/addSupplierInfo`,
        formData
      );
      // const d = {
      //   ...userDetails,
      //   ...formData,
      // };

      // setUserDetails({
      //   ...userDetails,
      //   ...formData,
      // });
      localStorage.setItem('user', JSON.stringify(d));
      toast.success(res.data?.data?.message || 'Supplier profile updated');
      setIsSubmitting(false);
      // onNext();
    } catch (e) {
      toast.error(
        e.response?.data?.error || 'failed: Supplier profile updated'
      );
      setIsSubmitting(false);
    }
  };
  return (
    <FormContainer>
      <div style={{ maxWidth: '500px', marginTop: '4rem' }}>
        <h1>Update Account status</h1>
        <div className='mb-2'>
          <label className='form-label'>Profile Status</label>
          <select
            value={status}
            className={`form-control`}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value={false}>Inactive</option>
            <option value={true}>Active</option>
          </select>
          {/* <div className='invalid-feedback'>{errors.status?.message}</div> */}
        </div>
        <button
          type='submit'
          className='btn btn-primary my-2 my-sm-0'
          // disabled={isSubmitting}
          onClick={onSubmit}
        >
          {isSubmitting && <Spinner width='15px' height='15px' />} Save
        </button>
      </div>
    </FormContainer>
  );
};

export default ActivateAccount;
