import { Box } from '@mui/material';
import { useForm } from 'react-hook-form';

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = (data) => {
    console.log('Form Data:', data);
    // Add your logic to handle the reset password functionality
  };

  const newPassword = watch('newPassword');

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '2rem',
      }}
    >
      <div style={{ maxWidth: '500px', width: '100%' }}>
        <h2 className='mb-4'>Reset Password</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='mb-3'>
            <label htmlFor='oldPassword' className='form-label'>
              Old Password
            </label>
            <input
              type='password'
              id='oldPassword'
              className={`form-control ${
                errors.oldPassword ? 'is-invalid' : ''
              }`}
              {...register('oldPassword', {
                required: 'Old password is required',
              })}
            />
            {errors.oldPassword && (
              <div className='invalid-feedback'>
                {errors.oldPassword.message}
              </div>
            )}
          </div>

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
              {...register('newPassword', {
                required: 'New password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters long',
                },
              })}
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
              {...register('confirmNewPassword', {
                required: 'Please confirm your new password',
                validate: (value) =>
                  value === newPassword || 'Passwords do not match',
              })}
            />
            {errors.confirmNewPassword && (
              <div className='invalid-feedback'>
                {errors.confirmNewPassword.message}
              </div>
            )}
          </div>

          <div className='mb-3'>
            <label htmlFor='email' className='form-label'>
              Email
            </label>
            <input
              type='email'
              id='email'
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: 'Enter a valid email address',
                },
              })}
            />
            {errors.email && (
              <div className='invalid-feedback'>{errors.email.message}</div>
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

export default ResetPassword;
