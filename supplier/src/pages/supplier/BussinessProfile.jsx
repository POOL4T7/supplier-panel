import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import * as yup from 'yup';
import { useAtom } from 'jotai';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import axiosInstance from '../../axios';
import { bussinessProfile, userDetailsAtom } from '../../storges/user';
import Spinner from '../../components/common/Spinner';

const bussinessSchema = yup
  .object()
  .shape({
    businessName: yup.string().required('Business name is required'),
    businessNickName: yup
      .string()
      .required('Business nick name is required')
      .max(50, 'Nickname must not exceed 50 characters')
      .test('nickname-count', 'Maximum 4 nicknames are allowed', (value) => {
        if (!value) return true;
        const nicknames = value.split(',').map((nickname) => nickname.trim());
        return nicknames.length <= 4;
      }),
    businessKeyWords: yup
      .string()
      .required('Business keyword is required')
      .max(250, 'Business keywords must not exceed 250 characters')
      .test('keyword-count', 'Maximum 10 keywords are allowed', (value) => {
        if (!value) return true;
        const keywords = value.split(',').map((keyword) => keyword.trim());
        return keywords.length < 10;
      }),
    aboutUs: yup.string().required('about us is required'),
    streetName: yup.string().required('Stree tName is required'),
    area: yup.string().optional(),
    houseNo: yup.string().required('building no. is required'),
    zipcode: yup.string().required('zipcode is required'),
    city: yup.string().required('City is required'),
    country: yup.string().required('Country is required'),
    premisesType: yup.string().required('Premises type is required'),
    premisesName: yup.string().optional(),
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

    sector: yup.string().required('Sector is required'),
    businessTaxId: yup.string().required('Business tax ID is required'),
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

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export default function BussinessProfile() {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [addressOTP, setAddressOTP] = useState('');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [supplier] = useAtom(userDetailsAtom);
  const [bussiness, setBussiness] = useAtom(bussinessProfile);
  const [certificate, setCertificate] = useState(null);
  // const [shopImageFile, setShopImageFile] = useState(null);
  const [certificateLink, setCertificateLink] = useState('');
  const [shopImageLink, setShopImageLink] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const [shopImageLoading, setShopImageLoading] = useState(false);
  const [certificateBase64, setCertificateBase64] = useState({
    file: '',
    extension: '',
  });
  const [shopImage, setShopImage] = useState({
    file: '',
    extension: '',
  });

  // const [keywords, setKeywords] = useState([]);
  // const [keywordsInput, setKeywordsInput] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    // control,
    // setValue,
    trigger,
    getValues,
    setError,
    clearErrors,
  } = useForm({
    resolver: yupResolver(bussinessSchema),
    mode: 'onTouched',
    defaultValues: {
      businessName: '',
      streetName: '',
      area: '',
      houseNo: '',
      zipcode: '',
      city: '',
      country: '',
      premisesType: '',
      premisesName: '',
      businessTaxId: '',
      website: '',
      email: '',
      sector: '',
    },
  });
  console.log('errors', errors);
  useEffect(() => {
    const x = {
      businessName: '',
      businessNickName: '',
      businessKeyWords: '',
      streetName: '',
      area: '',
      houseNo: '',
      zipcode: '',
      city: '',
      country: '',
      premisesType: '',
      premisesName: '',
      website: '',
      email: '',
      faxCountryCode: '',
      faxNumber: '',
      mobileCountryCode: '',
      mobileNumber: '',
      whatsappCountryCode: '',
      whatsappNumber: '',
      sector: '',
      businessTaxId: '',
    };
    if (bussiness?.id) {
      if (bussiness.businessName) x.businessName = bussiness.businessName;
      if (bussiness.businessNickName)
        x.businessNickName = bussiness.businessNickName.join(',');
      if (bussiness.businessKeyWords)
        x.businessKeyWords = bussiness.businessKeyWords.join(',');
      if (bussiness.streetName) x.streetName = bussiness.streetName;
      if (bussiness.aboutUs) x.aboutUs = bussiness.aboutUs;
      if (bussiness.area) x.area = bussiness.area;
      if (bussiness.houseNo) x.houseNo = bussiness.houseNo;
      if (bussiness.zipcode) x.zipcode = bussiness.zipcode;
      if (bussiness.city) x.city = bussiness.city;
      if (bussiness.country) x.country = bussiness.country;
      if (bussiness.premisesType) x.premisesType = bussiness.premisesType;
      if (bussiness.premisesName) x.premisesName = bussiness.premisesName;
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
      if (bussiness.sector) x.sector = bussiness.sector;
      if (bussiness.businessTaxId) x.businessTaxId = bussiness.businessTaxId;
      setCertificateLink(bussiness.certificateImagePath);
      setShopImageLink(bussiness.businessImagePath);
      reset(x);
      const fetchByteArray = async (type) => {
        try {
          const response = await axiosInstance.get(
            `/proxy/productsearchsupplier/api/supplier/file/getCertificateOrBusinessImage?supplierBusinessId=${bussiness.id}&type=${type}`,
            {
              responseType: 'arraybuffer', // Important for binary data
            }
          );

          let docType = 'application/pdf'; // Default to PDF

          if (type === 'Certificate' && bussiness.certificateImagePath) {
            const extension = bussiness.certificateImagePath
              .split('.')
              .pop()
              .toLowerCase(); // Extract file extension
            if (['jpeg', 'jpg', 'png'].includes(extension)) {
              docType = `image/${extension}`;
            }
          }

          if (type === 'BusinessImage') {
            // Assuming BusinessImage is always PNG for now
            docType = 'image/png';
          }

          console.log('Determined Content-Type:', docType);

          const blob = new Blob([response.data], { type: docType });
          const url = URL.createObjectURL(blob);

          if (type == 'BusinessImage') {
            setShopImage({ file: url, extension: docType.split('/').pop() });
          } else {
            setCertificateBase64({
              file: url,
              extension: docType.split('/').pop(),
            });
          }

          console.log('Generated Blob URL:', url);
        } catch (error) {
          console.error('Error fetching byte array:', error);
        }
      };

      if (bussiness.certificateImagePath) fetchByteArray('Certificate');
      if (bussiness.businessImagePath) fetchByteArray('BusinessImage');
    }
  }, [reset, bussiness]);

  const onSubmit = async (data) => {
    try {
      delete data.businessDescription;

      data.businessKeyWords = data.businessKeyWords.split(',');
      data.businessNickName = data.businessNickName.split(',');
      data.certificateImagePath = certificateLink;
      data.businessImagePath = shopImageLink;

      // productsearchsupplier/api/supplier/file/saveSupplierBusinessDetails
      const res = await axiosInstance.post(
        `/proxy/productsearchsupplier/api/supplier/file/saveSupplierBusinessDetails`,
        { ...data, supplierId: supplier.id, supplierBusinessId: bussiness.id }
      );

      setBussiness({
        ...bussiness,
        ...res.data.supplierBusinessProfile,
      });
      console.log(bussiness, res.data.supplierBusinessProfile);
      // reset({ ...res.data.supplierBusinessProfile });

      toast.success(
        res.data?.data?.message || 'Supplier bussiness profile updated'
      );
      // saveData(data); // Save step data before moving on
    } catch (e) {
      console.log(e);
      toast.error(
        e.response?.data?.error || 'failed: Supplier profile updated'
      );
    }
  };

  const uplaodCertificate = async () => {
    // e.preventDefault();
    setImageLoading(true);

    const formData = new FormData();
    formData.append('file', certificate[0]);
    formData.append('supplierBusinessId', bussiness.id);
    formData.append('type', 'Certificate');
    try {
      const res = await axiosInstance.post(
        '/proxy/productsearchsupplier/api/supplier/file/uploadBusinessImageOrCertificatePreview',
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
    formData.append('type', 'BusinessImage');
    try {
      const res = await axiosInstance.post(
        '/proxy/productsearchsupplier/api/supplier/file/uploadBusinessImageOrCertificatePreview',
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

      // setShopImageLink(res.data?.filePath);
      // setShopImageLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const validateFirstForm = async () => {
    const name = await trigger('businessName');
    const nickName = await trigger('businessNickName');
    const keyword = await trigger('businessKeyWords');
    const aboutUs = await trigger('aboutUs');
    const streetName = await trigger('streetName');
    const area = await trigger('area');
    const houseNo = await trigger('houseNo');
    const zipcode = await trigger('zipcode');
    const city = await trigger('city');
    const country = await trigger('country');
    if (
      !name ||
      !nickName ||
      !keyword ||
      !aboutUs ||
      !streetName ||
      !area ||
      !houseNo ||
      !zipcode ||
      !city ||
      !country
    )
      return;

    if (!bussiness.verifyAddress) {
      try {
        const values = getValues();
        const res = await axiosInstance.post(
          '/proxy/productsearchsupplier/api/supplier/file/validateBusinessAddressPresentOrNot',
          {
            supplierId: supplier.id,
            businessName: values.businessName,
            houseNo: values.houseNo,
            streetName: values.streetName,
            area: values.area,
            zipcode: values.zipcode,
            city: values.city,
            country: values.country,
          }
        );
        console.log(res);
        // toast.success('Address OTP verified');
      } catch (e) {
        console.log(e);
        toast.error(e?.response?.data?.message || 'Something went wrong');
      }
    }
    setValue(1);
  };
  const validateSecondForm = async () => {
    const values = getValues(); // Get all form values

    // Trigger validation for individual fields
    const premisesType = await trigger('premisesType');
    const premisesName = await trigger('premisesName');
    const website = await trigger('website');
    const email = await trigger('email');

    // Check contact details validation
    const { faxCountryCode, faxNumber, mobileCountryCode, mobileNumber } =
      values;

    let contactValidation = false;
    let contactErrorMessage = '';

    if ((faxCountryCode && faxNumber) || (mobileCountryCode && mobileNumber)) {
      contactValidation = true;
    } else {
      contactErrorMessage =
        'At least one valid contact method (Fax or Mobile) is required.';
    }

    // Set custom error for contact details if invalid
    if (!contactValidation) {
      setError('contactDetails', {
        type: 'manual',
        message: contactErrorMessage,
      });
    } else {
      clearErrors('contactDetails'); // Clear any existing contact details error
    }

    // If any validation fails, return early
    if (
      !premisesType ||
      !premisesName ||
      !website ||
      !email ||
      !contactValidation
    ) {
      return;
    }

    // If everything is valid, proceed to the next step
    setValue(2);
  };

  const verifyAddress = async () => {
    try {
      const res = await axiosInstance.post(
        '/proxy/productsearchsupplier/api/supplier/file/verifyAddress',
        {
          supplierBusinessId: bussiness.id,
          addressOTP: addressOTP,
        }
      );
      console.log(res);
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || 'something went wrong');
    }
  };

  return (
    <div className='row'>
      <div className='col-9'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box>
            <Box
              sx={{
                bgcolor: 'background.paper',
                marginTop: '2rem',
                // width: '700px',
              }}
            >
              <AppBar position='static'>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  indicatorColor='secondary'
                  textColor='inherit'
                  variant='fullWidth'
                  aria-label='full width tabs example'
                  centered
                  sx={{
                    bgcolor: 'primary.light',
                  }}
                >
                  {/* <Tab label='Bussiness Address' {...a11yProps(0)} />
                  <Tab
                    label='Business Web Address Contact details'
                    {...a11yProps(1)}
                  />
                  <Tab
                    label='Business Nature & Tax details'
                    {...a11yProps(2)}
                  /> */}
                  <Tab
                    label='Bussiness Address'
                    {...a11yProps(0)}
                    disabled={value !== 0}
                  />
                  <Tab
                    label='Business Web Address Contact details'
                    {...a11yProps(1)}
                    disabled={value !== 1}
                  />
                  <Tab
                    label='Business Nature & Tax details'
                    {...a11yProps(2)}
                    disabled={value !== 2}
                  />
                </Tabs>
              </AppBar>
              <TabPanel
                value={value}
                index={0}
                dir={theme.direction}
                sx={{ color: 'primary-light' }}
              >
                <>
                  <div className='row'>
                    <div className='col-6'>
                      <div className='mb-2'>
                        <label className='form-label'>Business Name</label>
                        <input
                          type='text'
                          {...register('businessName')}
                          className={`form-control ${
                            errors.businessName ? 'is-invalid' : ''
                          }`}
                        />
                        <div className='invalid-feedback'>
                          {errors.businessName?.message}
                        </div>
                      </div>
                    </div>
                    <div className='col-6'>
                      <div className='mb-2'>
                        <label className='form-label'>
                          Bussiness Nick Name
                        </label>
                        <input
                          type='text'
                          {...register('businessNickName')}
                          className={`form-control ${
                            errors.businessNickName ? 'is-invalid' : ''
                          }`}
                        />
                        <div className='invalid-feedback'>
                          {errors.businessNickName?.message}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='mb-2'>
                    <label className='form-label'>Bussiness Keywords</label>
                    <input
                      type='text'
                      {...register('businessKeyWords')}
                      className={`form-control ${
                        errors.businessKeyWords ? 'is-invalid' : ''
                      }`}
                      // value={keywordsInput}
                      // onChange={(e) => setKeywordsInput(e.target.value)}
                    />
                    <small>comma seperated keywords (ex: key1, key2)</small>
                    <div className='invalid-feedback'>
                      {errors.businessKeyWords?.message}
                    </div>
                  </div>
                  <div className='mb-2'>
                    <label className='form-label'>About Us</label>
                    <textarea
                      type='text'
                      {...register('aboutUs')}
                      className={`form-control ${
                        errors.aboutUs ? 'is-invalid' : ''
                      }`}
                    />

                    <div className='invalid-feedback'>
                      {errors.aboutUs?.message}
                    </div>
                  </div>
                  {/* <div className='row mb-2'>
                  <div className='col-10'>
                    <div className=''>
                      <label className='form-label'>Bussiness Keywords</label>{' '}
                      array of string
                      <input
                        type='text'
                        // {...register('keyWord')}
                        className={`form-control`}
                        value={keywordsInput}
                        onChange={(e) => setKeywordsInput(e.target.value)}
                      />
                      <div className='invalid-feedback'>
                        {errors.keyWord?.message}
                      </div>
                    </div>
                  </div>
                  <div className='col-2'>
                    <button
                      type='button'
                      className='btn btn-primary mt-4'
                      onClick={() => {
                        setKeywords([...keywords, keywordsInput]);
                        setKeywordsInput('');
                      }}
                    >
                      Add
                    </button>
                  </div>
                  <div className='mt-2'>
                    {keywords.map((item, idx) => (
                      <span
                        key={idx}
                        className='badge rounded-pill bg-primary px-3 py-2 text-white m-1'
                        style={{ cursor: 'pointer' }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div> */}

                  <div className='mb-2'>
                    <label className='form-label'>Premises Type</label>
                    <div>
                      <label className='form-label'>
                        <input
                          type='radio'
                          value='individual'
                          {...register('premisesType')}
                        />
                        <span className='mr-2'>Individual Premises</span>
                      </label>
                      <label className='form-label m-2'>
                        <input
                          type='radio'
                          value='group'
                          {...register('premisesType')}
                        />
                        Group of Bussiness Premises (Malls)
                      </label>
                    </div>
                    <div className='invalid-feedback'>
                      {errors.premisesType?.message}
                    </div>
                  </div>

                  {watch('premisesType') == 'group' && (
                    <div className='mb-2'>
                      <label className='form-label'>Premises name</label>
                      <input
                        type='text'
                        {...register('premisesName')}
                        placeholder='Premises name'
                        className={`form-control ${
                          errors.premisesName ? 'is-invalid' : ''
                        }`}
                      />
                      <div className='invalid-feedback'>
                        {errors.premisesName?.message}
                      </div>
                    </div>
                  )}
                  <div className='row'>
                    <div className='col-6 mb-2'>
                      <label className='form-label'>Street Name</label>
                      <input
                        type='text'
                        {...register('streetName')}
                        placeholder='Stree Name'
                        className={`form-control ${
                          errors.streetName ? 'is-invalid' : ''
                        }`}
                      />
                      <div className='invalid-feedback'>
                        {errors.streetName?.message}
                      </div>
                    </div>
                    <div className='mb-2 col-6'>
                      <label className='form-label'>Building no.</label>
                      <input
                        type='text'
                        {...register('houseNo')}
                        placeholder='House no.'
                        className={`form-control ${
                          errors.houseNo ? 'is-invalid' : ''
                        }`}
                      />
                      <div className='invalid-feedback'>
                        {errors.houseNo?.message}
                      </div>
                    </div>
                  </div>
                  <div className='mb-2 '>
                    <label className='form-label'>Place / locality name</label>
                    <input
                      type='text'
                      {...register('area')}
                      placeholder='Area or locality'
                      className={`form-control ${
                        errors.area ? 'is-invalid' : ''
                      }`}
                    />
                    <div className='invalid-feedback'>
                      {errors.area?.message}
                    </div>
                  </div>

                  <div className='row'>
                    <div className='col-sm-4 mb-2'>
                      <label className='form-label'>Zipcode</label>
                      <input
                        type='text'
                        {...register('zipcode')}
                        className={`form-control ${
                          errors.zipcode ? 'is-invalid' : ''
                        }`}
                        // disabled={isUpdating}
                      />
                      <div className='invalid-feedback'>
                        {errors.zipcode?.message}
                      </div>
                    </div>

                    <div className='col-sm-4 mb-2'>
                      <label className='form-label'>
                        City / Town / Village
                      </label>
                      <input
                        type='text'
                        {...register('city')}
                        className={`form-control ${
                          errors.city ? 'is-invalid' : ''
                        }`}
                        // disabled={isUpdating}
                      />
                      <div className='invalid-feedback'>
                        {errors.city?.message}
                      </div>
                    </div>

                    <div className='col-sm-4 mb-2'>
                      <label className='form-label'>Country</label>
                      <input
                        type='text'
                        {...register('country')}
                        className={`form-control ${
                          errors.country ? 'is-invalid' : ''
                        }`}
                        // disabled={isUpdating}
                      />
                      <div className='invalid-feedback'>
                        {errors.country?.message}
                      </div>
                    </div>
                    {!bussiness.verifyAddress && (
                      <>
                        <div className='row mt-3'>
                          <div className='col-10'>
                            <div className=' mb-2'>
                              <label className='form-label'>
                                Address verification OTP
                              </label>
                              <input
                                type='text'
                                value={addressOTP}
                                className={`form-control`}
                                onChange={(e) => setAddressOTP(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className='col-2 '>
                            <button
                              type='button'
                              className='btn btn-primary '
                              style={{ marginTop: '30px' }}
                              onClick={verifyAddress}
                            >
                              Validate
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
                <div className='d-flex gap-2'>
                  {/* <button
                    type='button'
                    className='btn btn-primary mt-3 '
                    onClick={validateFirstForm}
                  >
                    Prev
                  </button> */}
                  <button
                    type='button'
                    className='btn btn-primary mt-3 '
                    onClick={validateFirstForm}
                  >
                    Next
                  </button>
                </div>
              </TabPanel>
              <TabPanel value={value} index={1} dir={theme.direction}>
                <>
                  <div className='mb-2'>
                    <label className='form-label'>
                      Business website address / domain name
                    </label>
                    <input
                      type='text'
                      {...register('website')}
                      className={`form-control ${
                        errors.website ? 'is-invalid' : ''
                      }`}
                    />
                    <div className='invalid-feedback'>
                      {errors.website?.message}
                    </div>
                  </div>

                  <div className='mb-2'>
                    <label className='form-label'>E-mail address</label>
                    <input
                      type='email'
                      {...register('email')}
                      className={`form-control ${
                        errors.email ? 'is-invalid' : ''
                      }`}
                    />
                    <div className='invalid-feedback'>
                      {errors.email?.message}
                    </div>
                  </div>
                  {/* second part start here */}
                  <p className='mt-4 mb-2 fw-bold fs-4'>
                    Business Contact numbers{' '}
                  </p>

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
                        <label className='form-label'>
                          Fixed Number / Fax Number
                        </label>
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
                        <label className='form-label'>
                          Mobile / Cell Phone number
                        </label>
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
                  <div className='d-flex gap-2'>
                    <button
                      type='button'
                      className='btn btn-primary mt-3 '
                      onClick={() => setValue(0)}
                    >
                      Prev
                    </button>
                    <button
                      type='button'
                      className='btn btn-primary mt-3 '
                      onClick={validateSecondForm}
                    >
                      Next
                    </button>
                  </div>
                </>
              </TabPanel>
              <TabPanel value={value} index={2} dir={theme.direction}>
                <div className='accordion-body'>
                  <div className='mb-2'>
                    <label className='form-label'>Business Sector</label>
                    <select
                      {...register('sector')}
                      className={`form-control ${
                        errors.sector ? 'is-invalid' : ''
                      }`}
                    >
                      <option value=''>Select Sector</option>
                      <option value='product / retail'>
                        {' '}
                        Products / Retail{' '}
                      </option>
                      <option value='wholesale traders'>
                        Wholesale traders
                      </option>
                      <option value='retail and wholesale'>
                        Retail and wholesale
                      </option>
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
                    <div className='invalid-feedback'>
                      {errors.sector?.message}
                    </div>
                  </div>

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
                        // accept='image/*'
                        onChange={(e) => setCertificate(e.target.files)}
                      />
                      <button
                        type='button'
                        className='btn btn-primary'
                        id='uploadButton'
                        onClick={async (e) => {
                          e.preventDefault();
                          await uplaodCertificate('Certificate');
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
                    {['jpeg', 'png'].includes(certificateBase64.extension) ? (
                      <img
                        src={certificateBase64.file}
                        alt='Preview'
                        style={{ width: '300px' }}
                      />
                    ) : (
                      <iframe
                        src={certificateBase64.file}
                        title='PDF Preview'
                        width='300px'
                        height='100%'
                        style={{ border: 'none' }}
                      />
                    )}
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
                      type='button'
                      className='btn btn-outline-primary mt-3 '
                      onClick={() => setValue(1)}
                    >
                      Prev
                    </button>
                    <button
                      type='submit'
                      className='btn btn-primary mt-3'
                      disabled={isSubmitting}
                    >
                      {isSubmitting && <Spinner width='15px' height='15px' />}{' '}
                      Save
                    </button>
                  </div>
                </div>
              </TabPanel>
            </Box>
          </Box>
        </form>
      </div>
      <div className='col-3'>
        <label
          htmlFor='image-upload'
          style={{
            display: 'block',
            width: '100%',
            cursor: 'pointer',
          }}
        >
          <Box
            sx={{
              marginTop: '2rem',
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
                style={{ height: '100%', width: '100%', objectFit: 'cover' }}
              />
            ) : (
              <p style={{ color: 'gray' }}>Click to upload shop image</p>
            )}
          </Box>
          <input
            id='image-upload'
            type='file'
            accept='image/*'
            hidden
            onChange={uplaodShopImage}
          />
        </label>
        <Box
          sx={{
            marginTop: '1rem',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <button
            // component='label'
            // variant='outlined'
            // sx={{
            //   textTransform: 'none',
            //   display: 'flex',
            //   alignItems: 'center',
            // }}
            onClick={handleSubmit(onSubmit)}
            disabled={shopImageLoading}
            className='btn btn-primary my-2'
          >
            {shopImageLoading ? (
              <>
                {' '}
                <Spinner width='15px' height='15px' /> Upoading
              </>
            ) : (
              'Save'
            )}
          </button>
        </Box>
      </div>
    </div>
  );
}
