import { useState } from 'react';
import axiosInstance from '../../../axios';
import { toast } from 'react-toastify';
import { bussinessProfile } from '../../../storges/user';
import { useAtom } from 'jotai';
import FormContainer from '../../../components/common/FormContainer';
import Spinner from '../../../components/common/Spinner';

const Verify = () => {
  const [addressOTP, setAddressOTP] = useState('');
  const [bussiness, setBussiness] = useAtom(bussinessProfile);
  const [loading, setLoading] = useState(false);

  const verifyAddress = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.post(
        '/proxy/productsearchsupplier/api/supplier/file/verifyAddress',
        {
          supplierBusinessId: bussiness.id,
          addressOTP: addressOTP,
        }
      );
      // console.log(res);
      toast.success(res.data.message);
      setLoading(false);
      setAddressOTP('');
      setBussiness({ ...bussiness, verifyAddress: true });
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || 'something went wrong');
      setLoading(false);
    }
  };
  return (
    <FormContainer>
      <div style={{ maxWidth: '500px', width: '100%', marginTop: '2rem' }}>
        <h1>Verify the business address</h1>
        {bussiness.verifyAddress ? (
          <p style={{ color: '#7d9138', textDecoration: 'underline' }}>
            Address is verified
          </p>
        ) : (
          <></>
        )}
        <div className='mt-3' style={{ maxWidth: '400px' }}>
          <div className=' mb-2'>
            <label className='form-label'>Enter OTP</label>
            <input
              type='text'
              value={addressOTP}
              className={`form-control`}
              onChange={(e) => setAddressOTP(e.target.value)}
            />
          </div>

          <button
            type='button'
            className='btn btn-primary mt-3'
            onClick={verifyAddress}
            disabled={loading || bussiness.verifyAddress}
          >
            {loading ? (
              <>
                {' '}
                <Spinner width='15px' height='15px' /> Validating..{' '}
              </>
            ) : (
              <> Validate</>
            )}
          </button>
        </div>
      </div>
    </FormContainer>
  );
};

export default Verify;
