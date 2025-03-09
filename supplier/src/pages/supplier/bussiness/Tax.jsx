import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import axiosInstance from '../../../axios';
import { bussinessProfile, userDetailsAtom } from '../../../storges/user';
import FormContainer from '../../../components/common/FormContainer';
// import { useNavigate } from 'react-router-dom';
import Spinner from '../../../components/common/Spinner';
import { Box } from '@mui/material';

const addressSchema = yup.object().shape({
  // sector: yup.string().required('Sector is required'),
  businessTaxId: yup.string().required('Business tax ID is required'),
});

const Tax = () => {
  const [supplier] = useAtom(userDetailsAtom);
  const [bussiness] = useAtom(bussinessProfile);
  //   const navigate = useNavigate();
  const [certificate, setCertificate] = useState(null);
  // const [shopImageFile, setShopImageFile] = useState(null);
  const [certificateLink, setCertificateLink] = useState('');
  const [shopImageLink, setShopImageLink] = useState('');
  const [shopLogoLink, setShopLogoLink] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const [shopImageLoading, setShopImageLoading] = useState(false);
  const [shopLogoLoading, setShopLogoLoading] = useState(false);
  const [certificateBase64, setCertificateBase64] = useState({
    file: '',
    extension: '',
  });
  const [shopImage, setShopImage] = useState({
    file: '',
    extension: '',
  });
  const [shopLogo, setShopLogo] = useState({
    file: '',
    extension: '',
  });

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
      data.certificateImagePath = certificateLink;
      data.businessImagePath = shopImageLink;
      data.businessLogoPath = shopLogoLink;
      // console.log({
      //   ...data,
      //   supplierId: supplier.id,
      //   supplierBusinessId: bussiness.id,
      // });

      const res = await axiosInstance.post(
        `/proxy/productsearchsupplier/api/supplier/file/addSupplierBusinessNatureAndTaxDetails`,
        { ...data, supplierId: supplier.id, supplierBusinessId: bussiness.id }
      );

      toast.success(
        res.data?.data?.message || 'Supplier bussiness profile updated'
      );
      // setBussiness({ ...bussiness, ...data });
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
      sector: '',
      businessTaxId: '',
    };
    if (bussiness?.id) {
      // if (bussiness.sector) x.sector = bussiness.sector;
      if (bussiness.businessTaxId) x.businessTaxId = bussiness.businessTaxId;
      if (bussiness.businessImagePath)
        setShopImageLink(bussiness.businessImagePath);
      if (bussiness.businessLogoPath)
        setShopLogoLink(bussiness.businessLogoPath);
      if (bussiness.certificateImagePath)
        setCertificateLink(bussiness.certificateImagePath);

      reset(x);
      const fetchByteArray = async (type) => {
        try {
          const response = await axiosInstance.get(
            // `/proxy/productsearchsupplier/api/supplier/file/getCertificateOrBusinessImage?supplierBusinessId=${
            //   bussiness.id
            // }&type=${type.toLowerCase()}`,
            `/proxy/productsearchsupplier/api/supplier/file/getCertificateOrBusinessImageOrLogo?supplierBusinessId=${bussiness.id}&type=${type}`
          );

          // let docType = 'application/pdf'; // Default to PDF
          // if (type === 'Certificate' && bussiness.certificateImagePath) {
          //   const extension = bussiness.certificateImagePath
          //     .split('.')
          //     .pop()
          //     .toLowerCase(); // Extract file extension
          //   console.log('extension', extension);
          //   if (['jpeg', 'jpg', 'png', 'webp'].includes(extension)) {
          //     docType = `image/${extension}`;
          //   }
          // }
          // // alert(type , bussiness.certificateImagePath )
          // else {
          //   // Assuming BusinessImage is always PNG for now
          //   docType = 'image/png';
          // }

          // console.log('Determined Content-Type:', docType);

          // const blob = new Blob([response.data], { type: docType });
          // const url = URL.createObjectURL(blob);

          if (type == 'BusinessImage') {
            setShopImage({
              file: response.data.path,
              extension: 'image',
            });
          } else if (type === 'Certificate') {
            setCertificateBase64({
              file: response.data.path,
              extension: 'image',
            });
          } else {
            setShopLogo({ file: response.data.path, extension: 'image' });
          }
        } catch (error) {
          console.error('Error fetching byte array:', error);
        }
      };

      if (bussiness.certificateImagePath) fetchByteArray('Certificate');
      if (bussiness.businessImagePath) fetchByteArray('BusinessImage');
      if (bussiness.businessLogoPath) fetchByteArray('BusinessLogo');
    }
  }, [reset, bussiness]);
  // console.log(getValues());
  const uplaodCertificate = async () => {
    // e.preventDefault();
    setImageLoading(true);

    const formData = new FormData();
    formData.append('file', certificate[0]);
    formData.append('supplierBusinessId', bussiness.id);
    formData.append('type', 'Certificate');
    try {
      const res = await axiosInstance.post(
        '/proxy/productsearchsupplier/api/supplier/file/uploadBusinessImageOrCertificateOrLogoPreview',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const contentType = certificate[0].type || 'application/octet-stream';
      const blob = new Blob([certificate[0]], {
        type: contentType,
      });

      const url = URL.createObjectURL(blob);
      setCertificateBase64({
        file: url,
        extension: contentType.split('/').pop(),
      });

      setCertificateLink(res.data?.filePath);
      setImageLoading(false);

      // const url = URL.createObjectURL(blob);
      // setShopImage({
      //   file: url,
      //   extension: contentType.split('/').pop(),
      // });

      // setShopImageLink(res.data?.filePath);
      // setShopImageLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const uplaodShopImage = async (e) => {
    // e.preventDefault();
    setShopImageLoading(true);
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append('file', file);
    formData.append('supplierBusinessId', bussiness.id);
    formData.append('type', 'BusinessLogo');
    try {
      const res = await axiosInstance.post(
        '/proxy/productsearchsupplier/api/supplier/file/uploadBusinessImageOrCertificateOrLogoPreview',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const contentType = file.type || 'image/png';
      const blob = new Blob([file], {
        type: contentType,
      });

      const url = URL.createObjectURL(blob);
      setShopImage({
        file: url,
        extension: contentType.split('/').pop(),
      });

      setShopImageLink(res.data?.filePath);
      setShopImageLoading(false);

      // const url = URL.createObjectURL(blob);
      // setShopImage({
      //   file: url,
      //   extension: contentType.split('/').pop(),
      // });

      // setShopLogoLink(res.data?.filePath);
      // setShopImageLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const uplaodShopLogo = async (e) => {
    // e.preventDefault();
    setShopLogoLoading(true);
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append('file', file);
    formData.append('supplierBusinessId', bussiness.id);
    formData.append('type', 'BusinessLogo');
    try {
      const res = await axiosInstance.post(
        '/proxy/productsearchsupplier/api/supplier/file/uploadBusinessImageOrCertificateOrLogoPreview',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      const contentType = file.type || 'image/png';
      const blob = new Blob([file], {
        type: contentType,
      });

      const url = URL.createObjectURL(blob);
      setShopLogo({
        file: url,
        extension: contentType.split('/').pop(),
      });

      setShopLogoLink(res.data?.filePath);
      setShopLogoLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <FormContainer>
      <div style={{ maxWidth: '500px', width: '100%', marginTop: '2rem' }}>
        <h1>Business Nature & Tax details</h1>
        <form>
          {/* <div className='mb-2'>
            <label className='form-label'>Business Sector</label>
            <select
              {...register('sector')}
              className={`form-control ${errors.sector ? 'is-invalid' : ''}`}
            >
              <option value=''>Select Sector</option>
              <option value='product / retail'> Products / Retail </option>
              <option value='wholesale traders'>Wholesale traders</option>
              <option value='retail and wholesale'>Retail and wholesale</option>
              <option value='services'>Services</option>
              <option value='products and services'>
                Products and Services
              </option>
              <option value='manufacturing'>Manufacturing</option>
              <option value='charity organizations'>
                Charity organizations
              </option>

              <option value='wholeGovt organizationssale'>
                Govt Organizations
              </option>
              <option value='Individuals/ freelancers'>
                Individuals/ freelancers
              </option>
            </select>
            <div className='invalid-feedback'>{errors.sector?.message}</div>
          </div> */}

          <div className='mb-2'>
            <label className='form-label'>Business Tax ID</label>
            <input
              type='text'
              {...register('businessTaxId')}
              className={`form-control ${
                errors.businessTaxId ? 'is-invalid' : ''
              }`}
            />
            <div className='invalid-feedback'>
              {errors.businessTaxId?.message}
            </div>
          </div>

          <div className='mb-3'>
            <label htmlFor='certificate' className='form-label'>
              Business Certificate
            </label>
            <div className='input-group'>
              <input
                type='file'
                className='form-control mx-2'
                id='certificateInput'
                accept='image/*'
                onChange={(e) => setCertificate(e.target.files)}
              />
              <button
                type='button'
                className='btn btn-primary'
                id='uploadButton'
                onClick={async (e) => {
                  e.preventDefault();
                  await uplaodCertificate();
                }}
              >
                {imageLoading ? (
                  <Spinner width='15px' height='15px' />
                ) : (
                  'Upload'
                )}
              </button>
            </div>
          </div>

          <div className='preview-box' id='previewBox'>
            {!certificateBase64 && (
              <span className='preview-placeholder'>
                No Certificate Uploaded
              </span>
            )}
            {['image'].includes(certificateBase64.extension) ? (
              <img
                src={certificateBase64.file}
                alt='Preview'
                // style={{ width: '300px' }}
              />
            ) : (
              <iframe
                src={certificateBase64.file}
                title='PDF Preview'
                width='200px'
                height='200px'
                style={{ border: 'none' }}
              />
            )}
          </div>

          <div className='row'>
            <div className='col-12 col-lg-6'>
              <label
                htmlFor='shop-image-upload'
                style={{
                  display: 'block',
                  width: '100%',
                  cursor: 'pointer',
                  marginTop: '2rem',
                }}
              >
                <span className='mb-0'>Bussiness Image</span>
                <Box
                  sx={{
                    // marginTop: '2rem',
                    height: '200px',
                    width: '100%',
                    border: '1px dashed gray',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#f8f8f8',
                  }}
                >
                  {shopImage ? (
                    <img
                      src={shopImage.file}
                      alt='Preview'
                      style={{
                        height: '100%',
                        width: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <div style={{ color: 'gray' }}>
                      <p>Click to upload shop image</p>
                      {shopImageLoading && (
                        <div className='d-flex'>
                          {' '}
                          <Spinner width='25px' height='25px' />{' '}
                        </div>
                      )}
                    </div>
                  )}
                </Box>
                <input
                  id='shop-image-upload'
                  type='file'
                  accept='image/*'
                  hidden
                  onChange={uplaodShopImage}
                />
              </label>
            </div>
            <div className='col-12 col-lg-6'>
              <label
                htmlFor='shop-logo-upload'
                style={{
                  display: 'block',
                  width: '100%',
                  cursor: 'pointer',
                  marginTop: '2rem',
                }}
              >
                <span className='mb-0'>Bussiness Logo</span>
                <Box
                  sx={{
                    // marginTop: '2rem',
                    height: '200px',
                    width: '100%',
                    border: '1px dashed gray',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#f8f8f8',
                  }}
                >
                  {shopLogo ? (
                    <img
                      src={shopLogo.file}
                      alt='Preview'
                      style={{
                        height: '100%',
                        width: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <div style={{ color: 'gray' }}>
                      <p>Click to upload shop image</p>
                      {shopLogoLoading && (
                        <div className='d-flex'>
                          {' '}
                          <Spinner width='25px' height='25px' />{' '}
                        </div>
                      )}
                    </div>
                  )}
                </Box>
                <input
                  id='shop-logo-upload'
                  type='file'
                  accept='image/*'
                  hidden
                  onChange={uplaodShopLogo}
                />
              </label>
              <Box
                sx={{
                  marginTop: '1rem',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              ></Box>
            </div>
          </div>
          <div>
            {Object.keys(errors)?.length > 0 && (
              <div style={{ color: '#d9534f' }}>
                {' '}
                * {Object.keys(errors)[0]} is required
              </div>
            )}
          </div>
          <div className='d-flex gap-2'>
            <button
              type='submit'
              className='btn btn-primary mt-3'
              disabled={isSubmitting}
              onClick={handleSubmit(onSubmit)}
            >
              {isSubmitting && <Spinner width='15px' height='15px' />} Save
            </button>
          </div>
        </form>
      </div>
    </FormContainer>
  );
};

export default Tax;
