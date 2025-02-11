import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { useAtom } from 'jotai';
import { userDetailsAtom } from '../../storges/user';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import axiosInstance from '../../axios';

const categorySchema = yup.object().shape({
  productOrService: yup
    .string()
    .required('Product/Service selection is required'),
  productCategory: yup.string().optional(),
  productSubCategory: yup.string().optional(),
  serviceCategory: yup.string().optional(),
  serviceSubCategory: yup.string().optional(),
});

const BussinessCategory = ({ data }) => {
  const [supplier] = useAtom(userDetailsAtom);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(categorySchema),
    mode: 'onTouched',
  });

  const onSubmit = async (data) => {
    try {
      data.supplierId = supplier?.id;
      const res = await axios.post(
        `/proxy/productsearchsupplier/api/supplier/file/saveSupplierBusinessDetails`,
        data
      );
      toast.success(
        res.data?.data?.message || 'Supplier profile updated successfully'
      );
    } catch (e) {
      toast.error(
        e.response?.data?.error || 'Failed to update supplier profile'
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await axiosInstance.get(
        '/proxy/productsearchsupplier/getCategoryAndSubCategoryDetailsDetails?type=products'
      );
      console.log(res);
    };
    fetchData();
    reset(data);
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='mb-2'>
        <label className='form-label'>Products / Services</label>
        <select
          {...register('productOrService')}
          className={`form-control ${
            errors.productOrService ? 'is-invalid' : ''
          }`}
        >
          <option value=''>Select Type</option>
          <option value='products'>Products</option>
          <option value='services'>Services</option>
          <option value='both'>Both</option>
        </select>
        <div className='invalid-feedback'>
          {errors.productOrService?.message}
        </div>
      </div>

      {watch('productOrService') === 'products' && (
        <ProductList setValue={setValue} errors={errors} />
      )}
      {watch('productOrService') === 'services' && (
        <ServiceList setValue={setValue} errors={errors} />
      )}
      {watch('productOrService') === 'both' && (
        <>
          <ProductList setValue={setValue} errors={errors} />
          <ServiceList setValue={setValue} errors={errors} />
        </>
      )}

      <button type='submit' className='btn btn-primary my-2'>
        Save
      </button>
    </form>
  );
};

const ProductList = ({ setValue, errors }) => {
  return (
    <>
      <div className='mb-2'>
        <label className='form-label'>Product Category</label>
        <select
          className={`form-control ${
            errors.productCategory ? 'is-invalid' : ''
          }`}
          onChange={(e) => setValue('productCategory', e.target.value)}
        >
          <option value=''>Select Category</option>
          <option value='electronics'>Electronics</option>
          <option value='apparel'>Apparel</option>
        </select>
        <div className='invalid-feedback'>
          {errors.productCategory?.message}
        </div>
      </div>
      <div className='mb-2'>
        <label className='form-label'>Product Sub Category</label>
        <select
          className={`form-control ${
            errors.productSubCategory ? 'is-invalid' : ''
          }`}
          onChange={(e) => setValue('productSubCategory', e.target.value)}
        >
          <option value=''>Select Subcategory</option>
          <option value='phones'>Phones</option>
          <option value='computers'>Computers</option>
        </select>
        <div className='invalid-feedback'>
          {errors.productSubCategory?.message}
        </div>
      </div>
    </>
  );
};

const ServiceList = ({ setValue, errors }) => {
  return (
    <>
      <div className='mb-2'>
        <label className='form-label'>Service Category</label>
        <select
          className={`form-control ${
            errors.serviceCategory ? 'is-invalid' : ''
          }`}
          onChange={(e) => setValue('serviceCategory', e.target.value)}
        >
          <option value=''>Select Category</option>
          <option value='consulting'>Consulting</option>
          <option value='maintenance'>Maintenance</option>
        </select>
        <div className='invalid-feedback'>
          {errors.serviceCategory?.message}
        </div>
      </div>
      <div className='mb-2'>
        <label className='form-label'>Service Sub Category</label>
        <select
          className={`form-control ${
            errors.serviceSubCategory ? 'is-invalid' : ''
          }`}
          onChange={(e) => setValue('serviceSubCategory', e.target.value)}
        >
          <option value=''>Select Subcategory</option>
          <option value='it'>IT</option>
          <option value='plumbing'>Plumbing</option>
        </select>
        <div className='invalid-feedback'>
          {errors.serviceSubCategory?.message}
        </div>
      </div>
    </>
  );
};

export default BussinessCategory;

ProductList.propTypes = {
  setValue: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};

ServiceList.propTypes = {
  setValue: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};

BussinessCategory.propTypes = {
  data: PropTypes.object,
};
