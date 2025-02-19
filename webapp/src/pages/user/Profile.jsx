import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axiosInstance from '../../axios';
import { useAtom } from 'jotai';
import { userDetailsAtom } from '../../storges/user';
import { toast } from 'react-toastify';
import Spinner from '../../components/common/Spinner';
import { Box } from '@mui/material';
import { useEffect } from 'react';

const step1Schema = yup.object().shape({
  userName: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  gender: yup.string().required('Gender is required'),
  phoneNumber: yup
    .string()
    .required('phoneNumber number is required')
    .matches(/^\d{10}$/, 'phoneNumber number must be 10 digits'),
  addressLine1: yup.string().required('Address Line 1 is required'),
  addressLine2: yup.string().optional(),
  zipcode: yup
    .string()
    .required('zipcode is required')
    .matches(/^\d{6}$/, 'zipcode must be 6 digits'),
  city: yup.string().required('City is required'),
  country: yup.string().required('Country is required'),
  status: yup.boolean(),
});

const Profile = () => {
  const [userDetails, setUserDetails] = useAtom(userDetailsAtom);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(step1Schema),
    mode: 'onTouched',
  });

  const onSubmit = async (data) => {
    try {
      delete data?.password;
      const formData = {
        userName: data.userName,
        gender: data.gender,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        zipcode: data.zipcode,
        phoneNumber: data.phoneNumber,
        email: data.email,
        country: data.country,
        userId: userDetails.id,
        status: data.status,
      };
      const res = await axiosInstance.post(
        `/proxy/productsearch/api/userProfile/addUserProfileInfo`,
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
      toast.success(res.data?.data?.message || 'User profile updated');

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
        const res = await axiosInstance.get(
          `/proxy/productsearch/api/userProfile/getUserProfileDetails?userProfileId=${userDetails?.id}`
        );
        console.log('res', res);
        reset({ ...userDetails, status: res?.data?.active });
      } catch (e) {
        console.log(e);
      }
    }
    console.log('userDetails', userDetails);
    if (userDetails?.id) fetchData();
    reset(userDetails);
  }, [reset, userDetails]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '2rem',
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ maxWidth: '700px', width: '100%' }}
      >
        <div className='mb-2'>
          <label className='form-label'>Supplier Name</label>
          <input
            type='text'
            {...register('userName')}
            className={`form-control ${errors.userName ? 'is-invalid' : ''}`}
          />
          <div className='invalid-feedback'>{errors.userName?.message}</div>
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

        <div className='mb-2'>
          <label className='form-label'>Email</label>
          <input
            type='email'
            {...register('email')}
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            disabled
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
          <div className='col-6'>
            <div className='mb-2'>
              <label className='form-label'>Country</label>
              <select
                {...register('country')}
                className={`form-control ${errors.country ? 'is-invalid' : ''}`}
              >
                <option value=''>Select Country</option>
                <option value='India'>India</option>
                <option value='USA'>USA</option>
                <option value='UK'>UK</option>
              </select>
              <div className='invalid-feedback'>{errors.country?.message}</div>
            </div>
          </div>
        </div>

        <button
          type='submit'
          className='btn btn-primary my-2 my-sm-0'
          disabled={isSubmitting}
        >
          {isSubmitting && <Spinner width='15px' height='15px' />} Save
        </button>
      </form>
    </Box>
  );
};

export default Profile;
