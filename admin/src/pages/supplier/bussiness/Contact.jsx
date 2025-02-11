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
  })
  .test(
    'at-least-one-contact',
    'At least one contact method is required (Fax, Mobile, or WhatsApp)',
    function (value) {
      const { faxNumber, mobileNumber, faxCountryCode, mobileCountryCode } =
        value;

      if (!faxNumber && !mobileNumber) {
        return this.createError({
          path: 'contactDetails', // Attach the error to the "premises" field
          message:
            'At least one valid contact method (Fax or Mobile) is required.',
        });
      }
      if (faxNumber && !faxCountryCode) {
        return this.createError({
          path: 'contactDetails', // Attach the error to the "premises" field
          message: 'country code is required for fax number',
        });
      }
      if (mobileNumber && !mobileCountryCode) {
        return this.createError({
          path: 'contactDetails', // Attach the error to the "premises" field
          message: 'country code is required for mobilr number',
        });
      }
      return true;
    }
  );

const Contact = () => {
  const [supplier] = useAtom(userDetailsAtom);
  const [bussiness, setBussiness] = useAtom(bussinessProfile);
  const navigate = useNavigate();
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
      if (bussiness.website) x.website = bussiness.website;
      if (bussiness.email) x.email = bussiness.email;

      reset(x);
    }
  }, [reset, bussiness]);

  return (
    <FormContainer>
      <div style={{ maxWidth: '500px',width: '100%', marginTop: '2rem' }}>
        <h1>Contact Details</h1>
        <form>
          <div className='mb-2'>
            <label className='form-label'>
              Business website address / domain name
            </label>
            <input
              type='text'
              {...register('website')}
              className={`form-control ${errors.website ? 'is-invalid' : ''}`}
            />
            <div className='invalid-feedback'>{errors.website?.message}</div>
          </div>

          <div className='mb-2'>
            <label className='form-label'>E-mail address</label>
            <input
              type='email'
              {...register('email')}
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            />
            <div className='invalid-feedback'>{errors.email?.message}</div>
          </div>
          {/* second part start here */}
          <p className='mt-4 mb-2 fw-bold fs-4'>Business Contact numbers </p>

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
                />
                {/* <div className='invalid-feedback'>
                          {errors.faxCountryCode?.message}
                        </div> */}
              </div>
            </div>
            <div className='col-9'>
              <div className='mb-2'>
                <label className='form-label'>Fixed Number / Fax Number</label>
                <input
                  type='text'
                  {...register('faxNumber')}
                  className={`form-control ${
                    errors.faxNumber ? 'is-invalid' : ''
                  }`}
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
                />
                {/* <div className='invalid-feedback'>
                          {errors.whatsappNumber?.message}
                        </div> */}
              </div>
            </div>
          </div>
          <div style={{ color: '#d9534f' }}>
            {errors.contactDetails?.message}
          </div>
        </form>
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
      </div>
    </FormContainer>
  );
};

export default Contact;
