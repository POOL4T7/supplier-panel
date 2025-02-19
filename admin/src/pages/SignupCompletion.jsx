import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FormContainer from '../components/common/FormContainer';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Spinner from '../components/common/Spinner';

const signupCompletionSchema = yup.object().shape({
  password: yup
    .string()
    .min(3, 'Password must be at least 3 characters')
    .required('Password is required'),
  confPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const SignupCompletion = () => {
  const [searchParams] = useSearchParams();

  const userEmail = searchParams.get('email');

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signupCompletionSchema),
  });

  const onSubmit = async (data) => {
    try {
      const email = atob(userEmail);
      const res = await axios.post(
        `/proxy/productsearchadmin/user/completeSupplierRegistration`,
        { ...data, email: email }
      );
      toast.success(res.data || 'Email is sended on your registred email id');
      console.log(res);
      navigate('/signin');
    } catch (e) {
      toast.error('something went wrong, please try again after some time');
      console.log(e);
    }
  };

  return (
    <FormContainer>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='complete-register-form'
        style={{
          maxWidth: '400px',
          width: '100%',
          marginTop: '6rem',
        }}
      >
        <h2>Complete your registration</h2>

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

        <div className='mb-3'>
          <label>Confirm Password</label>
          <input
            type='password'
            {...register('confPassword')}
            className={`form-control ${
              errors.confPassword ? 'is-invalid' : ''
            }`}
          />
          {errors.confPassword && (
            <div className='invalid-feedback'>
              {errors.confPassword.message}
            </div>
          )}
        </div>
        <button
          type='submit'
          className='btn btn-primary'
          disabled={isSubmitting}
        >
          {isSubmitting && <Spinner width='15px' height='15px' />} Set up
        </button>
      </form>
    </FormContainer>
  );
};

export default SignupCompletion;
