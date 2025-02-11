import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FormContainer from '../components/common/FormContainer';
import axiosInstance from '../axios';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { userDetailsAtom } from '../storges/user';
import { Link, useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import Spinner from '../components/common/Spinner';

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(3, 'Password must be at least 6 characters')
    .required('Password is required'),
  // userType: yup.string().oneOf(['Supplier', 'Admin'], 'Select a user type'),
});

const LoginForm = () => {
  const [userDetails, setUserDetails] = useAtom(userDetailsAtom);
  // const [allRoles] = useAtom(roles);
  const navigate = useNavigate();
  useEffect(() => {
    if (userDetails?.id) {
      // navigate('/profile');
    }
  }, [navigate, userDetails]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });
  const onSubmit = async (data) => {
    try {
      const res = await axiosInstance.post(
        `/proxy/productsearchsupplier/user/login`,
        data
      );
      console.log(res.data?.userDetails);

      if (res.data?.userDetails?.userType == 'Admin') {
        setUserDetails(res.data?.userDetails);
        localStorage.setItem('user', JSON.stringify(res.data?.userDetails));
        localStorage.setItem('authAccessToken', res.data.accessToken);
        window.location.href = '/admin/supplier-list';
      }
      //  else if (res.data?.userDetails?.userType == 'Supplier') {
      //   window.location.href = '/supplier/profile';
      // }
      else {
        // window.location.href = '/user/profile';
        localStorage.clear();
      }
    } catch (e) {
      toast.error(e.response?.data?.errorMessage || 'Something went wrong');
    }
  };

  return (
    <FormContainer>
      <div
        style={{
          maxWidth: '400px',
          width: '100%',
          marginTop: '6rem',
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className='login-form '>
          <h2>Login</h2>

          <div className='mb-3'>
            <label>Email</label>
            <input
              type='email'
              {...register('email')}
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            />
            {errors.email && (
              <div className='invalid-feedback'>{errors.email.message}</div>
            )}
          </div>

          <div className='mb-3'>
            <label>Password</label>
            <input
              type='password'
              {...register('password')}
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            />
            {errors.password && (
              <div className='invalid-feedback'>{errors.password.message}</div>
            )}
          </div>
          <button
            type='submit'
            className='btn btn-primary new_button'
            disabled={isSubmitting}
          >
            {isSubmitting && <Spinner width='15px' height='15px' />} Login
          </button>
        </form>
        <div className='row pt-3'>
          <div className='col-6'>
            <span style={{ color: '#abc184' }}> New Customer?</span>

            <Link className='link-primary' to='/register'>
              {' '}
              Register
            </Link>
          </div>
          <div className='col-6'>
            <Link className='link-primary' to='/forgot-password'>
              Forgot password ?
            </Link>
          </div>
        </div>
      </div>
    </FormContainer>
  );
};

export default LoginForm;
