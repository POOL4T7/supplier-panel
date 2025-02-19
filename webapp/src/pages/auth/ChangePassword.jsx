import { yupResolver } from '@hookform/resolvers/yup';
import { Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as yup from 'yup';
import axiosInstance from '../../axios';
import { toast } from 'react-toastify';

const changePasswordSchema = yup.object().shape({
  newPassword: yup
    .string()
    .min(3, 'Password must be at least 3 characters')
    .required('Password is required'),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const ChangePassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userEmail = searchParams.get('email');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(changePasswordSchema),
  });

  const onSubmit = async (data) => {
    const email = atob(userEmail);
    data.email = email;
    try {
      const res = await axiosInstance.post(
        '/proxy/productsearch/user/changePassword',
        data
      );
      toast.success(res.data);
      navigate('/signin');
    } catch (e) {
      console.log(e);
      console.log(e?.response?.data?.message || 'something went wrong');
    }
    // Add your logic to handle the reset password functionality
  };
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '6rem',
      }}
    >
      <div style={{ maxWidth: '500px', width: '100%' }}>
        <h2 className='mb-4'>Reset Password</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='mb-3'>
            <label htmlFor='newPassword' className='form-label'>
              New Password
            </label>
            <input
              type='password'
              id='newPassword'
              className={`form-control ${
                errors.newPassword ? 'is-invalid' : ''
              }`}
              {...register('newPassword')}
            />
            {errors.newPassword && (
              <div className='invalid-feedback'>
                {errors.newPassword.message}
              </div>
            )}
          </div>

          <div className='mb-3'>
            <label htmlFor='confirmNewPassword' className='form-label'>
              Confirm New Password
            </label>
            <input
              type='password'
              id='confirmNewPassword'
              className={`form-control ${
                errors.confirmNewPassword ? 'is-invalid' : ''
              }`}
              {...register('confirmNewPassword')}
            />
            {errors.confirmNewPassword && (
              <div className='invalid-feedback'>
                {errors.confirmNewPassword.message}
              </div>
            )}
          </div>

          <button type='submit' className='btn btn-primary'>
            Reset Password
          </button>
        </form>
      </div>
    </Box>
  );
};

export default ChangePassword;
