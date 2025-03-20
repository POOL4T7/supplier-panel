import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { useAtom } from 'jotai';
// import PropTypes from 'prop-types';
import axiosInstance from '../../../axios';
import { bussinessProfile, userDetailsAtom } from '../../../storges/user';
import FormContainer from '../../../components/common/FormContainer';

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FilePenLine, X as CancelIcon } from 'lucide-react';

const addressSchema = yup.object().shape({
  streetName: yup.string().required('Stree tName is required'),
  area: yup.string().optional(),
  houseNo: yup.string().required('building no. is required'),
  zipcode: yup.string().required('zipcode is required'),
  city: yup.string().required('City is required'),
  country: yup.string().required('Country is required'),
  premisesType: yup.string().required('Premises type is required'),
  premisesName: yup.string().optional(),
});

const Address = () => {
  const [supplier] = useAtom(userDetailsAtom);
  const [bussiness, setBussiness] = useAtom(bussinessProfile);
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(addressSchema),
    mode: 'onTouched',
  });
  const onSubmit = async (data) => {
    try {
      const res = await axiosInstance.post(
        `/proxy/productsearchsupplier/api/supplier/file/addSupplierBusinessAddressDetails`,
        { ...data, supplierId: supplier.id, supplierBusinessId: bussiness.id }
      );
      console.log(res);
      toast.success(
        res.data?.data?.message || 'Supplier bussiness profile updated'
      );
      const res2 = await axiosInstance.get(
        `/proxy/productsearchsupplier/api/supplier/file/supplierBusinessProfileDetails?supplierProfileId=${supplier?.id}`
      );

      if (res2.data.supplierBusinessDetails) {
        setBussiness(res2.data.supplierBusinessDetails);
      }
      // saveData(data); // Save step data before moving on
    } catch (e) {
      console.log(e);
      toast.error(
        e.response?.data?.error || 'failed: Supplier profile updated'
      );
    }
  };

  useEffect(() => {
    const x = {
      streetName: '',
      area: '',
      houseNo: '',
      zipcode: '',
      city: '',
      country: '',
      premisesType: '',
      premisesName: '',
    };
    if (bussiness?.id) {
      if (bussiness.streetName) x.streetName = bussiness.streetName;
      if (bussiness.area) x.area = bussiness.area;
      if (bussiness.houseNo) x.houseNo = bussiness.houseNo;
      if (bussiness.zipcode) x.zipcode = bussiness.zipcode;
      if (bussiness.city) x.city = bussiness.city;
      if (bussiness.country) x.country = bussiness.country;
      if (bussiness.premisesType) x.premisesType = bussiness.premisesType;
      if (bussiness.premisesName) x.premisesName = bussiness.premisesName;

      reset(x);
    }
  }, [reset, bussiness]);

  return (
    <FormContainer>
      <div style={{ maxWidth: '500px', width: '100%', marginTop: '2rem' }}>
        <div className='d-flex justify-content-between align-items-center'>
          <h2>Business Address</h2>
          <p
            className=' '
            style={{ height: '30px' }}
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? (
              <CancelIcon className='text-danger' />
            ) : (
              <FilePenLine className='text-primary' />
            )}
          </p>
        </div>
        <div className='row'>
          <div className='col-4'>
            <p>Physical address: </p>
          </div>
          <div className='col-8'>
            <>
              <button
                disabled={!bussiness.verifyAddress}
                className='btn btn-success'
              >
                Verified
              </button>
              <button
                disabled={bussiness.verifyAddress}
                className=' mx-2 btn btn-outline-danger'
                // to='/supplier/bussiness/verify'
                onClick={() => {
                  navigate('/supplier/bussiness/verify');
                }}
              >
                Verify
              </button>
            </>
          </div>
        </div>
        <form>
          <div className='mb-2'>
            <label className='form-label'>Premises Type</label>
            <div>
              <label className='form-label'>
                <input
                  type='radio'
                  value='individual'
                  {...register('premisesType')}
                  disabled={!editMode}
                />{' '}
                <span className='mr-2'>Individual Premises</span>
              </label>
              <label className='form-label m-2'>
                <input
                  type='radio'
                  value='group'
                  {...register('premisesType')}
                  disabled={!editMode}
                />
                {'  '} Group of Bussiness Premises (Malls)
              </label>
            </div>
            <div className='invalid-feedback'>
              {errors.premisesType?.message}
            </div>
          </div>

          {watch('premisesType') == 'group' && (
            <div className='mb-2'>
              <label className='form-label'>Premises name</label>
              <input
                type='text'
                {...register('premisesName')}
                placeholder='Premises name'
                className={`form-control ${
                  errors.premisesName ? 'is-invalid' : ''
                }`}
                disabled={!editMode}
              />
              <div className='invalid-feedback'>
                {errors.premisesName?.message}
              </div>
            </div>
          )}
          <div className='row'>
            <div className='col-6 mb-2'>
              <label className='form-label'>Street Name</label>
              <input
                type='text'
                {...register('streetName')}
                placeholder='Stree Name'
                className={`form-control ${
                  errors.streetName ? 'is-invalid' : ''
                }`}
                disabled={!editMode}
              />
              <div className='invalid-feedback'>
                {errors.streetName?.message}
              </div>
            </div>
            <div className='mb-2 col-6'>
              <label className='form-label'>Building no.</label>
              <input
                type='text'
                {...register('houseNo')}
                placeholder='House no.'
                className={`form-control ${errors.houseNo ? 'is-invalid' : ''}`}
                disabled={!editMode}
              />
              <div className='invalid-feedback'>{errors.houseNo?.message}</div>
            </div>
          </div>
          <div className='mb-2 '>
            <label className='form-label'>Place / locality name</label>
            <input
              type='text'
              {...register('area')}
              placeholder='Area or locality'
              className={`form-control ${errors.area ? 'is-invalid' : ''}`}
              disabled={!editMode}
            />
            <div className='invalid-feedback'>{errors.area?.message}</div>
          </div>

          <div className='row'>
            <div className='col-sm-6 mb-2'>
              <label className='form-label'>Zipcode</label>
              <input
                type='text'
                {...register('zipcode')}
                className={`form-control ${errors.zipcode ? 'is-invalid' : ''}`}
                // disabled={isUpdating}
                disabled={!editMode}
              />
              <div className='invalid-feedback'>{errors.zipcode?.message}</div>
            </div>

            <div className='col-sm-6 mb-2'>
              <label className='form-label'>City / Town / Village</label>
              <input
                type='text'
                {...register('city')}
                className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                // disabled={isUpdating}
                disabled={!editMode}
              />
              <div className='invalid-feedback'>{errors.city?.message}</div>
            </div>
          </div>
          <div className=' mb-2'>
            <label className='form-label'>Country</label>
            <input
              type='text'
              {...register('country')}
              className={`form-control ${errors.country ? 'is-invalid' : ''}`}
              // disabled={isUpdating}
              disabled={!editMode}
            />
            <div className='invalid-feedback'>{errors.country?.message}</div>
          </div>
        </form>
        {editMode && (
          <div className='d-flex gap-2'>
            <button
              type='button'
              className='btn btn-primary mt-3 '
              onClick={handleSubmit(onSubmit)}
            >
              Save
            </button>
            <button
              type='button'
              className='btn btn-primary mt-3'
              onClick={handleSubmit(async (data) => {
                try {
                  await onSubmit(data); // Call the API
                  navigate('/supplier/bussiness/contact'); // Navigate only if API succeeds
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

export default Address;
