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

const addressSchema = yup
  .object()
  .shape({
    website: yup
      .string()
      .required('Website is required')
      .matches(/.*\..*/, 'Invalid website'),
    email: yup.string().email('Invalid email').required('Email is required'),

    faxCountryCode: yup.string().optional(),
    faxNumber: yup.string().optional(),
    mobileCountryCode: yup.string().optional(),
    mobileNumber: yup.string().optional(),

    whatsappCountryCode: yup.string().optional(),
    whatsappNumber: yup.string().optional(),
    telegramCountryCode: yup.string().optional(),
    telegramNumber: yup.string().optional(),
  })
  .test(
    'at-least-one-contact',
    'At least one valid contact method (Fax, Mobile, WhatsApp, or Telegram) is required.',
    function (value) {
      const {
        faxNumber,
        faxCountryCode,
        mobileNumber,
        mobileCountryCode,
        whatsappNumber,
        whatsappCountryCode,
        telegramNumber,
        telegramCountryCode,
      } = value;

      // Ensure at least one contact method is provided
      if (!faxNumber && !mobileNumber && !whatsappNumber && !telegramNumber) {
        return this.createError({
          path: 'contactDetails',
          message:
            'At least one valid contact method (Fax, Mobile, WhatsApp, or Telegram) is required.',
        });
      }

      // Validate that country code is provided for each contact method
      if (faxNumber && !faxCountryCode) {
        return this.createError({
          path: 'faxCountryCode',
          message: 'Country code is required for fax number.',
        });
      }
      if (mobileNumber && !mobileCountryCode) {
        return this.createError({
          path: 'mobileCountryCode',
          message: 'Country code is required for mobile number.',
        });
      }
      if (whatsappNumber && !whatsappCountryCode) {
        return this.createError({
          path: 'whatsappCountryCode',
          message: 'Country code is required for WhatsApp number.',
        });
      }
      if (telegramNumber && !telegramCountryCode) {
        return this.createError({
          path: 'telegramCountryCode',
          message: 'Country code is required for Telegram number.',
        });
      }

      return true;
    }
  );

const Contact = () => {
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
      const res = await axiosInstance.post(
        `/proxy/productsearchsupplier/api/supplier/file/addSupplierBusinessContactDetails`,
        { ...data, supplierId: supplier.id, supplierBusinessId: bussiness.id }
      );

      toast.success(
        res.data?.data?.message || 'Supplier bussiness profile updated'
      );
      setBussiness({ ...bussiness, ...data });
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
      website: '',
      email: '',
      faxCountryCode: '',
      faxNumber: '',
      mobileCountryCode: '',
      mobileNumber: '',
      whatsappCountryCode: '',
      whatsappNumber: '',
      telegramCountryCode: '',
      telegramNumber: '',
    };
    if (bussiness?.id) {
      if (bussiness.faxCountryCode) x.faxCountryCode = bussiness.faxCountryCode;
      if (bussiness.faxNumber) x.faxNumber = bussiness.faxNumber;
      if (bussiness.mobileCountryCode)
        x.mobileCountryCode = bussiness.mobileCountryCode;
      if (bussiness.mobileNumber) x.mobileNumber = bussiness.mobileNumber;
      if (bussiness.whatsappCountryCode)
        x.whatsappCountryCode = bussiness.whatsappCountryCode;
      if (bussiness.whatsappCountryCode)
        x.whatsappCountryCode = bussiness.whatsappCountryCode;
      if (bussiness.whatsappNumber) x.whatsappNumber = bussiness.whatsappNumber;
      if (bussiness.telegramCountryCode)
        x.telegramCountryCode = bussiness.telegramCountryCode;
      if (bussiness.telegramNumber) x.telegramNumber = bussiness.telegramNumber;
      if (bussiness.website) x.website = bussiness.website;
      if (bussiness.email) x.email = bussiness.email;

      reset(x);
    }
  }, [reset, bussiness]);

  return (
    <FormContainer>
      <div style={{ maxWidth: '500px', width: '100%', marginTop: '2rem' }}>
        <div className='d-flex justify-content-between align-items-center'>
          <h2>Contact Details</h2>
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
        <form>
          <div className='mb-2'>
            <label className='form-label'>
              Business website address / domain name
            </label>
            <input
              type='text'
              {...register('website')}
              className={`form-control ${errors.website ? 'is-invalid' : ''}`}
              disabled={!editMode}
            />
            <div className='invalid-feedback'>{errors.website?.message}</div>
          </div>

          <div className='mb-2'>
            <label className='form-label'>E-mail address</label>
            <input
              type='email'
              {...register('email')}
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              disabled={!editMode}
            />
            <div className='invalid-feedback'>{errors.email?.message}</div>
          </div>
          {/* second part start here */}
          <h2 className='mt-4 mb-2'>Business Contact numbers </h2>

          <div className='row'>
            <div className='col-3'>
              <div className='mb-2'>
                <label className='form-label'>Country Code</label>
                <input
                  type='text'
                  {...register('faxCountryCode')}
                  className={`form-control ${
                    errors.faxCountryCode ? 'is-invalid' : ''
                  }`}
                  disabled={!editMode}
                />
                {/* <div className='invalid-feedback'>
                          {errors.faxCountryCode?.message}
                        </div> */}
              </div>
            </div>
            <div className='col-9'>
              <div className='mb-2'>
                <label className='form-label'>Fixed Number</label>
                <input
                  type='text'
                  {...register('faxNumber')}
                  className={`form-control ${
                    errors.faxNumber ? 'is-invalid' : ''
                  }`}
                  disabled={!editMode}
                />
                {/* <div className='invalid-feedback'>
                          {errors.faxNumber?.message}
                        </div> */}
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-3'>
              <div className='mb-2'>
                <label className='form-label'>Country Code</label>
                <input
                  type='text'
                  {...register('mobileCountryCode')}
                  className={`form-control ${
                    errors.mobileCountryCode ? 'is-invalid' : ''
                  }`}
                  disabled={!editMode}
                />
                {/* <div className='invalid-feedback'>
                          {errors.mobileCountryCode?.message}
                        </div> */}
              </div>
            </div>
            <div className='col-9'>
              <div className='mb-2'>
                <label className='form-label'>Mobile / Cell Phone number</label>
                <input
                  type='text'
                  {...register('mobileNumber')}
                  className={`form-control ${
                    errors.mobileNumber ? 'is-invalid' : ''
                  }`}
                  disabled={!editMode}
                />
                {/* <div className='invalid-feedback'>
                          {errors.mobileNumber?.message}
                        </div> */}
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-3'>
              <div className='mb-2'>
                <label className='form-label'>Country Code</label>
                <input
                  type='text'
                  {...register('whatsappCountryCode')}
                  className={`form-control ${
                    errors.whatsappCountryCode ? 'is-invalid' : ''
                  }`}
                  disabled={!editMode}
                />
                {/* <div className='invalid-feedback'>
                          {errors.whatsappCountryCode?.message}
                        </div> */}
              </div>
            </div>
            <div className='col-9'>
              <div className='mb-2'>
                <label className='form-label'>WhatsApp number</label>
                <input
                  type='text'
                  {...register('whatsappNumber')}
                  className={`form-control ${
                    errors.whatsappNumber ? 'is-invalid' : ''
                  }`}
                  disabled={!editMode}
                />
                {/* <div className='invalid-feedback'>
                          {errors.whatsappNumber?.message}
                        </div> */}
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-3'>
              <div className='mb-2'>
                <label className='form-label'>Country Code</label>
                <input
                  type='text'
                  {...register('telegramCountryCode')}
                  className={`form-control ${
                    errors.telegramCountryCode ? 'is-invalid' : ''
                  }`}
                  disabled={!editMode}
                />
                {/* <div className='invalid-feedback'>
                          {errors.telegramCountryCode?.message}
                        </div> */}
              </div>
            </div>
            <div className='col-9'>
              <div className='mb-2'>
                <label className='form-label'>Telegram number</label>
                <input
                  type='text'
                  {...register('telegramNumber')}
                  className={`form-control ${
                    errors.telegramNumber ? 'is-invalid' : ''
                  }`}
                  disabled={!editMode}
                />
                {/* <div className='invalid-feedback'>
                          {errors.telegramNumber?.message}
                        </div> */}
              </div>
            </div>
          </div>
          <div style={{ color: '#d9534f' }}>
            {errors.contactDetails?.message}
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
              className='btn btn-primary mt-3 '
              onClick={handleSubmit(async (data) => {
                try {
                  await onSubmit(data); // Call the API
                  navigate('/supplier/bussiness/tax-details'); // Navigate only if API succeeds
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

export default Contact;
