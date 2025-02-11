import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// import PropTypes from 'prop-types';
import * as yup from 'yup';
// import { isValidFileType, MAX_FILE_SIZE } from '../../utils/form';
import axiosInstance from '../../axios';
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { userDetailsAtom } from '../../storges/user';
import { toast } from 'react-toastify';
import Spinner from '../common/Spinner';

const step1Schema = yup.object().shape({
  supplierName: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  gender: yup.string().required('Gender is required'),
  phoneNumber: yup
    .string()
    .required('phoneNumber number is required')
    .matches(/^\d{10}$/, 'phoneNumber number must be 10 digits'),
  idProofFront: yup
    .mixed()
    // .required('Required')

    // .test('is-valid-type', 'Not a valid image type', (value) => {
    //   const file = value[0];
    //   return isValidFileType(file && file.name.toLowerCase(), 'image');
    // })
    // .test('is-valid-size', 'Max allowed size is 100KB', (value) => {
    //   const file = value[0];
    //   return file && file.size <= MAX_FILE_SIZE;
    // }),
    .optional(),
  idProofBack: yup
    .mixed()
    // .required('Required')

    // .test('is-valid-type', 'Not a valid image type', (value) => {
    //   const file = value[0];
    //   return isValidFileType(file && file.name.toLowerCase(), 'image');
    // })
    // .test('is-valid-size', 'Max allowed size is 100KB', (value) => {
    //   const file = value[0];
    //   return file && file.size <= MAX_FILE_SIZE;
    // })
    .optional(),
  addressLine1: yup.string().required('Address Line 1 is required'),
  addressLine2: yup.string().optional(),
  zipcode: yup
    .string()
    .required('zipcode is required')
    .matches(/^\d{6}$/, 'zipcode must be 6 digits'),
  city: yup.string().required('City is required'),
  country: yup.string().required('Country is required'),
  // status: yup.boolean(),
});

const SupplierDetails = () => {
  const [userDetails, setUserDetails] = useAtom(userDetailsAtom);
  const [laoding, setLaoding] = useState(true);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(step1Schema),
    mode: 'onTouched',
  });
  console.log('userDetails', userDetails);
  const onSubmit = async (data) => {
    try {
      delete data?.password;
      const formData = {
        supplierName: data.supplierName,
        gender: data.gender,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        zipcode: data.zipcode,
        phoneNumber: data.phoneNumber,
        email: data.email,
        country: data.country,
        supplierId: userDetails.id,
        // status: data.status,
      };
      const res = await axiosInstance.post(
        `/proxy/productsearchsupplier/api/supplier/profile/addSupplierInfo`,
        formData
      );
      const d = {
        ...userDetails,
        ...formData,
      };

      setUserDetails({
        ...userDetails,
        ...formData,
      });
      localStorage.setItem('user', JSON.stringify(d));
      toast.success(res.data?.data?.message || 'Supplier profile updated');

      // onNext();
    } catch (e) {
      toast.error(
        e.response?.data?.error || 'failed: Supplier profile updated'
      );
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLaoding(true);
        const res = await axiosInstance.get(
          `/proxy/productsearchsupplier/api/supplier/profile/supplierProfileDetails?supplierUserId=${userDetails?.id}`,
          {
            headers: {
              Authorization: `Bearer ${userDetails.accessToken}`,
            },
          }
        );

        reset({ ...userDetails, status: res?.data?.active });
        setLaoding(false);
      } catch (e) {
        console.log(e);
      }
    }
    if (userDetails?.id) fetchData();
  }, [reset, userDetails]);

  return (
    <>
      {laoding ? (
        <Spinner />
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ maxWidth: '500px', width: '100%' }}
        >
          <div className='mb-2'>
            <label className='form-label'>Supplier Name</label>
            <input
              type='text'
              {...register('supplierName')}
              className={`form-control ${
                errors.supplierName ? 'is-invalid' : ''
              }`}
            />
            <div className='invalid-feedback'>
              {errors.supplierName?.message}
            </div>
          </div>

          <div className='row'>
            <div className='col-sm-12 col-md-6 mb-2'>
              <label className='form-label'>Gender</label>
              <select
                {...register('gender')}
                className={`form-control ${errors.gender ? 'is-invalid' : ''}`}
              >
                <option value=''>Select Gender</option>
                <option value='male'>Male</option>
                <option value='female'>Female</option>
                <option value='other'>Other</option>
              </select>
              <div className='invalid-feedback'>{errors.gender?.message}</div>
            </div>

            <div className='col-sm-12 col-md-6 mb-2'>
              <label className='form-label'>Phone Number</label>
              <input
                type='text'
                {...register('phoneNumber')}
                className={`form-control ${
                  errors.phoneNumber ? 'is-invalid' : ''
                }`}
              />
              <div className='invalid-feedback'>
                {errors.phoneNumber?.message}
              </div>
            </div>
          </div>

          {/* <div className="row">
        <div className="col-sm-12 col-md-6 mb-2">
          <label>Upload ID Proof (Front)</label>
          <div
            className="upload-container"
            onClick={() => document.getElementById("idProofFront").click()}
          >
            <p className="upload-text">Click to upload or drag image here</p>
          </div>
          <input
            type="file"
            id="idProofFront"
            {...register("idProofFront")}
            className="d-none"
          />
          <div className="invalid-feedback">{errors.idProofFront?.message}</div>
        </div>

        <div className="col-sm-12 col-md-6 mb-2">
          <label>Upload ID Proof (Back)</label>
          <div
            className="upload-container"
            onClick={() => document.getElementById("idProofBack").click()}
          >
            <p className="upload-text">Click to upload or drag image here</p>
          </div>
          <input
            type="file"
            id="idProofBack"
            {...register("idProofBack")}
            className="d-none"
          />
          <div className="invalid-feedback">{errors.idProofBack?.message}</div>
        </div>
      </div> */}

          <div className='mb-2'>
            <label className='form-label'>Email</label>
            <input
              type='email'
              {...register('email')}
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              // disabled
            />
            <div className='invalid-feedback'>{errors.email?.message}</div>
          </div>

          {/* Address Fields */}
          <div className='row'>
            <div className='col-sm-12 col-md-6 mb-2'>
              <label className='form-label'>Address Line 1</label>
              <input
                type='text'
                {...register('addressLine1')}
                className={`form-control ${
                  errors.addressLine1 ? 'is-invalid' : ''
                }`}
              />
              <div className='invalid-feedback'>
                {errors.addressLine1?.message}
              </div>
            </div>

            <div className='col-sm-12 col-md-6 mb-2'>
              <label className='form-label'>Address Line 2</label>
              <input
                type='text'
                {...register('addressLine2')}
                className={`form-control ${
                  errors.addressLine2 ? 'is-invalid' : ''
                }`}
              />
              <div className='invalid-feedback'>
                {errors.addressLine2?.message}
              </div>
            </div>
          </div>

          <div className='row'>
            <div className='col-sm-12 col-md-6 mb-2'>
              <label className='form-label'>Zipcode</label>
              <input
                type='text'
                {...register('zipcode')}
                className={`form-control ${errors.zipcode ? 'is-invalid' : ''}`}
              />
              <div className='invalid-feedback'>{errors.zipcode?.message}</div>
            </div>

            <div className='col-sm-12 col-md-6 mb-2'>
              <label className='form-label'>City</label>
              <input
                type='text'
                {...register('city')}
                className={`form-control ${errors.city ? 'is-invalid' : ''}`}
              />
              <div className='invalid-feedback'>{errors.city?.message}</div>
            </div>
          </div>

          <div className='row'>
            <div className='col-12'>
              <div className='mb-2'>
                <label className='form-label'>Country</label>
                <select
                  {...register('country')}
                  className={`form-control ${
                    errors.country ? 'is-invalid' : ''
                  }`}
                >
                  <option value=''>Select Country</option>
                  <option value='India'>India</option>
                  <option value='USA'>USA</option>
                  <option value='UK'>UK</option>
                  {/* Add more countries as needed */}
                </select>
                <div className='invalid-feedback'>
                  {errors.country?.message}
                </div>
              </div>
            </div>
            {/* <div className='col-6'>
              <div className='mb-2'>
                <label className='form-label'>Profile Status</label>
                <select
                  {...register('status')}
                  className={`form-control ${
                    errors.status ? 'is-invalid' : ''
                  }`}
                >
                  <option value={false}>Inactive</option>
                  <option value={true}>Active</option>
                </select>
                <div className='invalid-feedback'>{errors.status?.message}</div>
              </div>
            </div> */}
          </div>

          <button
            type='submit'
            className='btn btn-primary my-2 my-sm-0'
            disabled={isSubmitting}
          >
            {isSubmitting && <Spinner width='15px' height='15px' />} Save
          </button>
        </form>
      )}
    </>
  );
};

// SupplierDetails.propTypes = {
//   onNext: PropTypes.func.isRequired,
// };

export default SupplierDetails;
