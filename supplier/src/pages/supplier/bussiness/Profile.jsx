import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import axiosInstance from '../../../axios';
import { bussinessProfile, userDetailsAtom } from '../../../storges/user';
import FormContainer from '../../../components/common/FormContainer';
import { Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FilePenLine, X as CancelIcon } from 'lucide-react';
import { Button } from '@mui/material';

const addressSchema = yup.object().shape({
  businessName: yup.string().required('Business name is required'),
  businessNickName: yup
    .string()
    .required('Business nick name is required')
    .max(50, 'Nickname must not exceed 50 characters')
    .test('nickname-count', 'Maximum 4 nicknames are allowed', (value) => {
      if (!value) return true;
      const nicknames = value.split(',').map((nickname) => nickname.trim());
      return nicknames.length <= 4;
    }),
  businessKeyWords: yup
    .string()
    .required('Business keyword is required')
    .max(250, 'Business keywords must not exceed 250 characters')
    .test('keyword-count', 'Maximum 10 keywords are allowed', (value) => {
      if (!value) return true;
      const keywords = value.split(',').map((keyword) => keyword.trim());
      return keywords.length <= 10;
    }),
  aboutUs: yup
    .string()
    .required('About us is required')
    .max(1500, 'About us must be at most 1500 characters'),
  sector: yup.string().required('Sector is required'),
});

const Profile = () => {
  const [supplier] = useAtom(userDetailsAtom);
  const [bussiness, setBussiness] = useAtom(bussinessProfile);
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(addressSchema),
    mode: 'onTouched',
  });

  const onSubmit = async (data) => {
    try {
      const r = JSON.parse(JSON.stringify(data));
      r.businessKeyWords = data.businessKeyWords.split(',');
      r.businessNickName = data.businessNickName.split(',');

      const res = await axiosInstance.post(
        `/proxy/productsearchsupplier/api/supplier/file/addSupplierBusinessDetails`,
        { ...r, supplierId: supplier.id, supplierBusinessId: bussiness.id }
      );

      toast.success(
        res.data?.data?.message || 'Supplier business profile updated'
      );
      setBussiness({ ...bussiness, ...r });
    } catch (e) {
      toast.error(
        e.response?.data?.error || 'Failed: Supplier profile update failed'
      );
    }
  };

  useEffect(() => {
    if (bussiness?.id) {
      console.log(bussiness);
      reset({
        businessName: bussiness.businessName || '',
        businessNickName: bussiness?.businessNickName?.join(',') || '',
        businessKeyWords: bussiness?.businessKeyWords?.join(',') || '',
        aboutUs: bussiness.aboutUs || '',
        sector: bussiness.sector || '',
      });
    }
  }, [reset, bussiness]);

  return (
    <FormContainer>
      <div style={{ maxWidth: '500px', width: '100%', marginTop: '2rem' }}>
        <div className='d-flex justify-content-between align-items-center'>
          <h2>About Business</h2>
          <div
            className=' '
            style={{ height: '30px' }}
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? (
              <Button
                variant='outlined'
                size='small'
                startIcon={<CancelIcon color='red' />}
              >
                Cancel
              </Button>
            ) : (
              <Button
                variant='outlined'
                size='small'
                startIcon={<FilePenLine size={18} color='green' />}
              >
                Edit
              </Button>
            )}
          </div>
        </div>
        <form>
          <div className='mb-2'>
            <label className='form-label'>Business Sector</label>
            <select
              {...register('sector')}
              className={`form-control ${errors.sector ? 'is-invalid' : ''}`}
              disabled={!editMode}
            >
              <option value=''>Select Sector</option>
              <option value='product / retail'> Products / Retail </option>
              <option value='wholesale traders'>Wholesale traders</option>
              <option value='retail and wholesale'>Retail and wholesale</option>
              <option value='services'>Services</option>
              <option value='products and services'>
                Products and Services
              </option>
              <option value='manufacturing'>Manufacturing</option>
              <option value='charity organizations'>
                Charity organizations
              </option>

              <option value='wholeGovt organizationssale'>
                Govt Organizations
              </option>
              <option value='Individuals/ freelancers'>
                Individuals/ freelancers
              </option>
            </select>
            <div className='invalid-feedback'>{errors.sector?.message}</div>
          </div>
          <div className='mb-2'>
            <label className='form-label'>Business Name</label>
            <input
              type='text'
              {...register('businessName')}
              className={`form-control ${
                errors.businessName ? 'is-invalid' : ''
              }`}
              disabled={!editMode}
            />
            <div className='invalid-feedback'>
              {errors.businessName?.message}
            </div>
          </div>
          <div className='mb-2'>
            <label className='form-label'>
              Business Nick Name{' '}
              <span
                className='d-inline-block'
                tabIndex='0'
                data-bs-toggle='tooltip'
                title='Nick name tooltip'
              >
                <Info size={15} />
              </span>
            </label>
            <input
              type='text'
              {...register('businessNickName')}
              className={`form-control ${
                errors.businessNickName ? 'is-invalid' : ''
              }`}
              disabled={!editMode}
            />
            <div className='invalid-feedback'>
              {errors.businessNickName?.message}
            </div>
          </div>
          <div className='mb-2'>
            <label className='form-label'>
              Business Keywords{' '}
              <span
                className='d-inline-block'
                tabIndex='0'
                data-bs-toggle='tooltip'
                title='Keywords tooltip'
              >
                <Info size={15} />
              </span>
            </label>
            <textarea
              {...register('businessKeyWords')}
              className={`form-control ${
                errors.businessKeyWords ? 'is-invalid' : ''
              }`}
              rows={3}
              disabled={!editMode}
            />
            <small>Comma-separated keywords (ex: key1, key2)</small>
            <div className='invalid-feedback'>
              {errors.businessKeyWords?.message}
            </div>
          </div>
          <div className='mb-2'>
            <label className='form-label'>About Us</label>
            <textarea
              {...register('aboutUs')}
              className={`form-control ${errors.aboutUs ? 'is-invalid' : ''}`}
              rows={5}
              disabled={!editMode}
            />
            <div className='invalid-feedback'>{errors.aboutUs?.message}</div>
          </div>
        </form>
        {editMode && (
          <div className='d-flex gap-2'>
            <button
              type='button'
              className='btn btn-primary mt-3'
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              Save
            </button>
            <button
              type='button'
              className='btn btn-primary mt-3'
              onClick={handleSubmit(async (data) => {
                try {
                  await onSubmit(data); // Call the API
                  navigate('/supplier/bussiness/address'); // Navigate only if API succeeds
                } catch (e) {
                  console.log(e);
                }
              })}
              disabled={isSubmitting}
            >
              Save & Next
            </button>
          </div>
        )}
      </div>
    </FormContainer>
  );
};

export default Profile;
