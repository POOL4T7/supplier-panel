import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FormContainer from '../components/common/FormContainer';
import axiosInstance from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
// import { roles } from '../storges/user';
// import { useAtom } from 'jotai';
import Spinner from '../components/common/Spinner';

const signupSchema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
  fullName: yup
    .string()
    .min(3, 'fullName must be at least 3 characters')
    .required('fullName is required'),
});

const Signup = () => {
  // const navigate = useNavigate();
  // const [allRoles] = useAtom(roles);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(signupSchema),
  });

  const onSubmit = async (data) => {
    try {
      data.userType = 'Supplier';
      const res = await axiosInstance.post(
        `/proxy/productsearchsupplier/user/register`,
        data
      );
      toast.success(
        res.data?.message || 'Email is sended on your registred email id'
      );
      localStorage.setItem('userEmail', data.email);
      // navigate('/register-completeion');
      reset();
    } catch (e) {
      toast.error('something went wrong, please try again after some time');
      console.log(e);
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='register-form'
          // style={{ maxWidth: '400px', width: '100%', marginTop: '6rem' }}
        >
          <h2>Supplier Signup</h2>
          {/* <div className='mb-3'>
            <label htmlFor='role' className='form-label'>
              Role
            </label>
            <select
              className={`form-select ${errors.userType ? 'is-invalid' : ''}`}
              id='role'
              {...register('userType')}
            >
              <option value=''>Select a role</option>
              {allRoles?.map((item) => (
                <option key={item.roleId} value={item.roleName}>
                  {item.roleName}
                </option>
              ))}
            </select>
            {errors.userType && (
              <div className='invalid-feedback'>{errors.userType.message}</div>
            )}
          </div> */}

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
            <label>Full Name</label>
            <input
              type='text'
              {...register('fullName')}
              className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
            />
            {errors.fullName && (
              <div className='invalid-feedback'>{errors.fullName.message}</div>
            )}
          </div>
          <button
            type='submit'
            className='btn btn-primary new_button'
            disabled={isSubmitting}
          >
            {isSubmitting && <Spinner width='15px' height='15px' />} Signup
          </button>
        </form>
        <div className='row pt-3'>
          <div className='col'>
            <span style={{ color: '#abc184' }}> Already have account?</span>

            <Link className='link-primary' to='/signin'>
              {' '}
              Login
            </Link>
          </div>
        </div>
      </div>
    </FormContainer>
  );
};

export default Signup;
