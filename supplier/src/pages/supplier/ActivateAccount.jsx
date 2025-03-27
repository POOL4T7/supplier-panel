import { useEffect, useState } from 'react';
import FormContainer from '../../components/common/FormContainer';
import axiosInstance from '../../axios';
import { toast } from 'react-toastify';
import Spinner from '../../components/common/Spinner';
import { userDetailsAtom } from '../../storges/user';
import { useAtom } from 'jotai';

const ActivateAccount = () => {
  const [status, setStatus] = useState('false');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [supplier] = useAtom(userDetailsAtom);
  const onSubmit = async () => {
    try {
      setIsSubmitting(true);
      const formData = {
        status: status === 'true',
        supplierProfileId: supplier.id,
      };
      const res = await axiosInstance.post(
        `/proxy/productsearchsupplier/api/supplier/profile/updateSupplierStatus`,
        formData
      );

      toast.success(
        res.data?.data?.message || 'Supplier Account status updated'
      );
      setIsSubmitting(false);
    } catch (e) {
      toast.error(
        e.response?.data?.error || 'failed: Supplier profile updated'
      );
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setStatus(`${supplier.active}`);
  }, [supplier.active]);

  return (
    <FormContainer>
      <div style={{ maxWidth: '500px', marginTop: '4rem' }}>
        <h1>Update Account status</h1>
        {status && (
          <p>
            Current status:{' '}
            <span
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                fontWeight: 'bold',
                color: status == 'true' ? '#155724' : '#721c24',
                // backgroundColor: status === 'true' ? '#d4edda' : '#f8d7da',
                // border:
                //   status === 'true' ? '1px solid #c3e6cb' : '1px solid #f5c6cb',
              }}
            >
              {status === 'true' ? 'Active' : 'Inactive'}
            </span>
          </p>
        )}

        <div className='mb-2'>
          <label className='form-label'>Select Profile Status</label>
          <select
            value={status}
            className={`form-control`}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value={''}></option>
            <option value={'false'}>Inactive</option>
            <option value={'true'}>Active</option>
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
