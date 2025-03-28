import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
// import Spinner from '../components/common/Spinner';
// import LocationIcon from '../components/common/LocationIcon';
import { Autocomplete, Box, Grid, TextField } from '@mui/material';
// import CircularProgress from '@mui/material/CircularProgress';
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  // Grid,
  Container,
} from '@mui/material';

import { useNavigate } from 'react-router-dom';
import Spinner from '../components/common/Spinner';
const formSchema = yup.object().shape({
  // country: yup.string().required("country is required"),
  address: yup.string().required('location is required'),
  searchTerm: yup.string().optional(),
});

const discounts = [
  {
    id: 1,
    image:
      'https://cms-images.mmst.eu/2rj3gcd43pmw/2xslVTe29DChwWBl7wq8if/6971ffc3da3db06f5758f71fcc563a7e/MMS_Logo_outline.svg?q=80',
    link: 'https://www.mediamarkt.de/',
    title: 'Limited Time Offer! 50% Off',
  },
  {
    id: 2,
    image:
      'https://www.spicevillage.eu/cdn/shop/files/Assetmlogo_1_250x@2x.png?v=1644484561',
    link: 'https://www.spicevillage.eu/',
    title: 'Buy One Get One Free',
  },
  {
    id: 3,
    image: 'https://delhi6-dev.kcspages.com/image/logo.png',
    link: 'https://delhi6-dev.kcspages.com/',
    title: 'Exclusive Deal for Members',
  },
  {
    id: 4,
    image:
      'https://tapas-mundo.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FlogoN.66bbeb8f.webp&w=256&q=75',
    link: 'https://tapas-mundo.com/',
    title: 'Holiday Special - 30% Off',
  },
];
const formSchema2 = yup
  .object()
  .shape({
    // country: yup.string().required("country is required"),
    address: yup.string().required('address is required'),
    searchTerm: yup.string().optional(),
    premises: yup.string().optional(),
    shop: yup.string().optional(),
  })
  .test(
    'premises-or-shop-required',
    'Either premises or shop is required',
    function (values) {
      const { premises, shop } = values || {};
      if (!premises?.trim() && !shop?.trim()) {
        return this.createError({
          path: 'premises', // Attach the error to the "premises" field
          message: 'Either premises or shop is required',
        });
      }
      return true;
    }
  );

const LandingPage = () => {
  // const [serviceList, setServiceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationSuggestion, setLocationSuggestion] = useState([]);
  const [premisesSuggestion, setPremisesSuggestion] = useState([]);
  const [shopSuggestion, setShopSuggestion] = useState([]);
  const [searchTerm, setSearchTerm] = useState([]);
  const [premisesList, setPremisesList] = useState([]);

  // const [country, setCountry] = useState("");

  let navigate = useNavigate();

  useEffect(() => {
    const loadPremises = async () => {
      try {
        setLoading(true);
        const res = await axios.post('/proxy/productsearch/premisesListing');

        setPremisesList(res.data);
        // setPremisesList([...res.data, ...res.data]);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    };
    loadPremises();
  }, []);

  const [formData, setFormData] = useState({
    address: '',
    country: '',
    searchTerm: '',
    premises: '',
    shop: '',
    location: '',
  });
  // eslint-disable-next-line no-unused-vars
  const [setsearchLocation, setSetsearchLocation] = useState(false);

  const form1 = useForm({
    resolver: yupResolver(formSchema),
  });
  const form2 = useForm({
    resolver: yupResolver(formSchema2),
  });

  const onSubmitForm1 = async (data) => {
    try {
      let loc = {};
      try {
        const x = JSON.parse(form1.watch('address'));
        loc = x;
      } catch (e) {
        console.log(e);
        loc = {
          houseNo: '',
          area: null,
          streetName: form1.watch('address'),
          zipcode: null,
          city: null,
        };
      }
      const newData = JSON.parse(JSON.stringify(data));
      newData.address = loc;
      newData.country = localStorage.getItem('country') || 'germany';
      // const res = await axios.post(
      //   `/proxy/productsearch/search`,
      //   newData
      // );

      navigate(`/search-result?q=${JSON.stringify(newData)}`);
      // setLoading(false);
    } catch (e) {
      console.log(e);
      toast.error(e.response?.data?.message || 'Something went wrong');
    }
  };

  const onSubmitForm2 = async (data) => {
    try {
      let loc = {};
      console.log("form2.watch('address')", form2.watch('address'));
      try {
        const x = JSON.parse(form2.watch('address'));
        loc = x;
      } catch (e) {
        console.log(e);
        loc = {
          houseNo: '',
          area: null,
          streetName: form2.watch('address'),
          zipcode: null,
          city: null,
        };
      }
      const newData = JSON.parse(JSON.stringify(data));
      newData.address = loc;
      newData.country = localStorage.getItem('country') || 'germany';
      // const res = await axios.post(
      //   `/proxy/productsearch/search`,
      //   newData
      // );

      navigate(`/search-result?q=${JSON.stringify(newData)}`);
      // setLoading(false);
    } catch (e) {
      console.log(e);
      toast.error(e.response?.data?.message || 'Something went wrong');
    }
  };

  const handleInputChange = async (inputValue) => {
    if (!inputValue.trim()) {
      return;
    }
    try {
      setSetsearchLocation(true);
      const res = await axios.post(`/proxy/productsearch/locationSuggestions`, {
        country: localStorage.getItem('country') || 'germany',
        location: inputValue,
      });

      setLocationSuggestion(
        res.data.map((item) => ({
          label: Object.values(item)
            .filter((x) => x != null)
            .join(', '),
          value: JSON.stringify(item),
        }))
      );
      setSetsearchLocation(false);
    } catch (error) {
      console.error('Error fetching business descriptions:', error);
    }
  };

  const handlePremisesAndShopInputChange = async (inputValue) => {
    if (!inputValue.trim()) {
      return;
    }
    let loc = {};
    console.log(form2.watch('address'), "form2.watch('address')");
    try {
      try {
        const x = JSON.parse(form2.watch('address'));

        loc = x;
      } catch (e) {
        console.log(e);
        loc = {
          houseNo: '',
          area: null,
          streetName: form2.watch('address'),
          zipcode: null,
          city: null,
        };
      }

      const res = await axios.post(
        `/proxy/productsearch/premisesOrShopSuggestions`,
        {
          premisesOrShopName: inputValue,
          type: 'premises',
          location: loc,
        }
      );

      setPremisesSuggestion(
        res.data.map((item) => ({
          label: item,
          value: item.premisesName,
        }))
      );
      // setShowPremisesLoading(false);
    } catch (error) {
      console.error('Error fetching business descriptions:', error);
    }
  };

  const handleSearchTerm = async (value) => {
    try {
      // productsearch/searchTermSuggestions
      const res = await axios.post(
        '/proxy/productsearch/searchTermSuggestions',
        {
          searchTerm: value,
        }
      );
      setSearchTerm(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleShopInputChange = async (inputValue) => {
    if (!inputValue.trim()) {
      return;
    }
    let loc = {};
    try {
      try {
        const x = JSON.parse(form2.watch('address'));
        loc = x;
      } catch (e) {
        console.log(e);
        loc = {
          houseNo: '',
          area: null,
          streetName: form2.watch('address'),
          zipcode: null,
          city: null,
        };
      }

      const res = await axios.post(
        `/proxy/productsearch/premisesOrShopSuggestions`,
        {
          premisesOrShopName: inputValue,
          type: 'shop',
          location: loc,
        }
      );
      console.log('API Response:', res.data);
      setShopSuggestion(
        res.data.map((item) => ({
          label: item,
          value: item.shopOrBusinessName,
        }))
      );
    } catch (error) {
      console.error('Error fetching business descriptions:', error);
    }
  };

  const debounceFetch = (func, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedInputChange = debounceFetch(handleInputChange, 500);

  const debouncedPremisesInputChange = debounceFetch(
    handlePremisesAndShopInputChange,
    500
  );
  const debouncedSearchTerm = debounceFetch(handleSearchTerm, 500);

  // const buildImage = (base64String) => {
  //   try {
  //     // Check if the string is empty or undefined
  //     if (!base64String) {
  //       return null;
  //     }

  //     // If the string already starts with 'data:', return as is
  //     if (base64String.startsWith('data:')) {
  //       return base64String;
  //     }

  //     // Create a complete data URL by adding the prefix
  //     const imageUrl = `data:image/jpeg;base64,${base64String}`;
  //     return imageUrl;
  //   } catch (error) {
  //     console.error('Error creating image URL:', error);
  //     return null;
  //   }
  // };
  return (
    <div className='search-main pt-5'>
      {/* search row start  */}
      <div
        className='search-row'
        // style={{ backgroundImage: "url('bg.jpg')" }}
      >
        <div className='search-sec'>
          {/* Country input start */}
          {/* <div className="country-box">
            <TextField
              id="outlined-basic"
              label="Country"
              variant="outlined"
              {...form1.register("country")}
              error={
                !!form1.formState.errors.country ||
                !!form2.formState.errors.country
              }
              helperText={
                form1.formState.errors.country?.message ||
                form2.formState.errors.country?.message
              }
              size="small"
              fullWidth
              onChange={(e) => {
                form1.setValue("country", e.target.value);
                form2.setValue("country", e.target.value);
                setCountry(e.target.value);
              }}
            />
          </div> */}
          {/* Country input end */}
          {/* Tabs Navigation */}
          <div className='search-tab'>
            <ul className='nav nav-tabs' id='formTabs' role='tablist'>
              <li className='nav-item'>
                <p style={{ marginTop: '10px' }}>Search By</p>
              </li>
              <li className='nav-item' role='presentation'>
                <button
                  className='nav-link active'
                  id='location-tab'
                  data-bs-toggle='tab'
                  data-bs-target='#location'
                  type='button'
                  role='tab'
                  aria-controls='location'
                  aria-selected='true'
                  onClick={() => {
                    setFormData({ ...formData, address: null });
                    setSearchTerm([]);
                  }}
                >
                  Location
                </button>
              </li>
              <li className='nav-item' role='presentation'>
                <button
                  className='nav-link'
                  id='premises-tab'
                  data-bs-toggle='tab'
                  data-bs-target='#premises'
                  type='button'
                  role='tab'
                  aria-controls='premises'
                  aria-selected='false'
                  onClick={() => {
                    setSearchTerm([]);
                  }}
                >
                  Business / Shop
                </button>
              </li>
            </ul>
          </div>

          {/* Tabs Content */}
          <div className='tab-content' id='formTabsContent'>
            {/* Location Form */}
            <div
              className='tab-pane fade serach-form show active'
              id='location'
              role='tabpanel'
              aria-labelledby='location-tab'
            >
              <form onSubmit={form1.handleSubmit(onSubmitForm1)}>
                <div className='row justify-content-center'>
                  {/* <div className='col-12 col-md-1 mb-2'>
                <TextField
                  id='outlined-basic'
                  label='Country'
                  variant='outlined'
                  {...form1.register('country')}
                  // placeholder='Country'
                  error={!!form1.formState.errors.country}
                  helperText={form1.formState.errors.country?.message}
                  size='small'
                  fullWidth
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div> */}

                  {/* Location Name Field */}
                  <div className='col-12 col-md-5 mb-3'>
                    <Controller
                      name='address'
                      control={form1.control}
                      defaultValue=''
                      rules={{
                        required: 'Location is required',
                      }}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          freeSolo
                          options={locationSuggestion} // Array of objects with label and value
                          getOptionLabel={(option) =>
                            typeof option === 'string' ? option : option.label
                          }
                          onInputChange={(event, value) => {
                            console.log(value); // For debugging
                            field.onChange(value || ''); // Ensure value is always a string
                            if (value.length > 2) {
                              debouncedInputChange(value); // Fetch suggestions
                            }
                          }}
                          onChange={(event, value) => {
                            console.log('changed', value); // For debugging
                            field.onChange(value?.value || ''); // Store only the `value` string
                          }}
                          size='small'
                          fullWidth
                          value={
                            locationSuggestion.find(
                              (item) => item.value === field.value
                            ) || null
                          } // Map `field.value` back to the selected option
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label='Type a location'
                              variant='outlined'
                              fullWidth
                              error={!!form1.formState.errors.address} // Show error if validation fails
                              helperText={
                                form1.formState.errors.address?.message
                              } // Display error message
                            />
                          )}
                          renderOption={(props, option) => (
                            <li key={option.value} {...props}>
                              {option.label}
                            </li>
                          )}
                          // loading={setsearchLocation}
                        />
                      )}
                    />
                  </div>

                  <div className='col-12 col-md-5 mb-3'>
                    <Controller
                      name='searchTerm'
                      control={form1.control}
                      defaultValue=''
                      // rules={{
                      //   required: 'searchTerm is required',
                      // }}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          freeSolo
                          options={searchTerm} // Array of objects with label and value
                          // getOptionLabel={searchTerm}
                          onInputChange={(event, value) => {
                            console.log(value); // For debugging
                            field.onChange(value || ''); // Ensure value is always a string
                            if (value.length > 2) {
                              debouncedSearchTerm(value); // Fetch suggestions
                            }
                          }}
                          onChange={(event, value) => {
                            console.log('changed', value); // For debugging
                            field.onChange(value || ''); // Store only the `value` string
                          }}
                          size='small'
                          fullWidth
                          // value={} // Map `field.value` back to the selected option
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label='Product / Service Name'
                              variant='outlined'
                              fullWidth
                              error={!!form1.formState.errors.searchTerm} // Show error if validation fails
                              helperText={
                                form1.formState.errors.searchTerm?.message
                              } // Display error message
                            />
                          )}
                          renderOption={(props, option) => (
                            <li key={option} {...props}>
                              {option}
                            </li>
                          )}
                          // loading={setsearchLocation}
                        />
                      )}
                    />
                  </div>

                  {/* <div className='col-12 col-md-5 mb-3'>
                    <TextField
                      id='outlined-basic'
                      label='Product / Service Name'
                      variant='outlined'
                      {...form1.register('searchTerm')}
                      error={!!form1.formState.errors.searchTerm}
                      helperText={form1.formState.errors.searchTerm?.message}
                      size='small'
                      fullWidth
                    />
                  </div> */}

                  {/* Submit Button */}
                  <div className='col-12 col-md-12'>
                    <button type='submit' className='search-btn search-btn1'>
                      Search
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Premises Form */}
            <div
              className='tab-pane fade serach-form'
              id='premises'
              role='tabpanel'
              aria-labelledby='premises-tab'
            >
              <form onSubmit={form2.handleSubmit(onSubmitForm2)}>
                <div className='row justify-content-center'>
                  {/* Country Field */}
                  {/* <div className='col-12 col-md-1 mb-2'>
                <TextField
                  id='outlined-basic'
                  label='Country'
                  variant='outlined'
                  {...form2.register('country')}
                  // placeholder='Country'
                  error={!!form1.formState.errors.country}
                  helperText={form1.formState.errors.country?.message}
                  size='small'
                  fullWidth
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div> */}

                  {/* Location Name Field */}
                  <div className='col-12 col-md-3 mb-2'>
                    <Controller
                      name='address'
                      control={form2.control}
                      rules={{
                        required: 'Location is required',
                      }}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          freeSolo
                          options={locationSuggestion}
                          getOptionLabel={(option) =>
                            typeof option === 'string' ? option : option.label
                          }
                          isOptionEqualToValue={(option, value) =>
                            option.value === value
                          }
                          onInputChange={(event, value, reason) => {
                            if (reason === 'input') {
                              form2.setValue('address', value || '');
                              if (value.length > 2) {
                                debouncedInputChange(value);
                              }
                            }
                          }}
                          onChange={(event, value) => {
                            form2.setValue('address', value ? value.value : '');
                          }}
                          size='small'
                          fullWidth
                          value={
                            locationSuggestion.find(
                              (item) => item.value === field.value
                            ) || null
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label='Type a location'
                              variant='outlined'
                              fullWidth
                              error={!!form2.formState.errors.address}
                              helperText={
                                form2.formState.errors.address?.message
                              }
                            />
                          )}
                          slotProps={{
                            popper: {
                              modifiers: [
                                {
                                  name: 'preventOverflow',
                                  options: { boundary: 'window' },
                                },
                              ],
                            },
                            paper: {
                              sx: {
                                width: 'auto', // Adjust width based on content
                                minWidth: 'max-content', // Ensures it doesn’t shrink to input width
                                maxWidth: '800px', // Optional: Limit maximum width
                              },
                            },
                          }}
                        />
                      )}
                    />
                  </div>

                  <div className='col-12 col-md-3 mb-2'>
                    <Controller
                      name='premises'
                      control={form2.control}
                      defaultValue=''
                      rules={{
                        required: 'premises is required',
                      }}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          freeSolo
                          fullWidth
                          size='small'
                          options={premisesSuggestion.map((item) => item.label)}
                          getOptionLabel={(option) =>
                            typeof option === 'string'
                              ? option
                              : option.premisesName || ''
                          }
                          onInputChange={(event, value) => {
                            field.onChange(value || '');
                            if (value.length > 2)
                              debouncedPremisesInputChange(value);
                          }}
                          value={
                            typeof field.value === 'string'
                              ? field.value
                              : field.value?.premisesName || ''
                          }
                          onChange={(event, newValue) => {
                            field.onChange(newValue.premisesName || '');
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label='Type a premises'
                              variant='outlined'
                              fullWidth
                              error={!!form2.formState.errors.premises}
                              helperText={
                                form2.formState.errors.premises?.message
                              }
                            />
                          )}
                          slotProps={{
                            popper: {
                              modifiers: [
                                {
                                  name: 'preventOverflow',
                                  options: { boundary: 'window' },
                                },
                              ],
                            },
                            paper: {
                              sx: {
                                width: 'auto', // Adjust width based on content
                                minWidth: 'max-content', // Ensures it doesn’t shrink to input width
                                maxWidth: '800px', // Optional: Limit maximum width
                              },
                            },
                          }}
                          renderOption={(props, option) => (
                            <li {...props} key={option.premisesName}>
                              {['premisesName', 'area', 'city', 'zipcode']
                                .map((key) => option[key]) // Extract values for the specified keys
                                .filter(
                                  (value) =>
                                    value != null && value.trim() !== ''
                                )
                                .join(', ')}
                            </li>
                          )}
                        />
                      )}
                    />
                  </div>

                  <div className='col-12 col-md-3 mb-2'>
                    <Controller
                      name='shop'
                      control={form2.control}
                      defaultValue=''
                      rules={{
                        required: 'shop is required',
                      }}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          freeSolo
                          fullWidth
                          componentsProps={{
                            paper: { sx: { width: '100%' } },
                          }}
                          size='small'
                          options={shopSuggestion.map((item) => item.label)}
                          getOptionLabel={(option) =>
                            typeof option === 'string'
                              ? option
                              : option.shopOrBusinessName || ''
                          }
                          onInputChange={(event, value) => {
                            field.onChange(value || '');
                            if (value.length > 2) handleShopInputChange(value);
                          }}
                          value={
                            typeof field.value === 'string'
                              ? field.value
                              : field.value?.shopOrBusinessName || ''
                          }
                          onChange={(event, newValue) => {
                            field.onChange(newValue.shopOrBusinessName || '');
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label='Type a shop'
                              variant='outlined'
                              fullWidth
                              error={!!form2.formState.errors.shop}
                              helperText={form2.formState.errors.shop?.message}
                            />
                          )}
                          slotProps={{
                            popper: {
                              modifiers: [
                                {
                                  name: 'preventOverflow',
                                  options: { boundary: 'window' },
                                },
                              ],
                            },
                            paper: {
                              sx: {
                                width: 'auto', // Adjust width based on content
                                minWidth: 'max-content', // Ensures it doesn’t shrink to input width
                                maxWidth: '800px', // Optional: Limit maximum width
                              },
                            },
                          }}
                          renderOption={(props, option) => (
                            <li
                              {...props}
                              key={option.shopOrBusinessName}
                              // style={{
                              //   whiteSpace: 'nowrap', // Prevent text wrapping
                              //   overflow: 'hidden', // Hide overflow
                              //   textOverflow: 'ellipsis', // Add "..." if text is too long
                              //   minWidth: '300px', // Make dropdown wider
                              //   padding: '8px 12px', // Improve spacing
                              // }}
                            >
                              <div>
                                <strong>{option.shopOrBusinessName}</strong>
                                <div
                                // style={{
                                //   display: 'flex',
                                //   flexWrap: 'wrap',
                                //   gap: '4px',
                                //   marginTop: '4px',
                                // }}
                                >
                                  {option.businessNickName.map(
                                    (nickname, index) => (
                                      <span
                                        key={index}
                                        style={{
                                          backgroundColor: '#f0f0f0',
                                          borderRadius: '16px',
                                          padding: '4px 8px',
                                          fontSize: '12px',
                                          color: '#333',
                                        }}
                                      >
                                        {nickname}
                                      </span>
                                    )
                                  )}
                                </div>
                              </div>
                            </li>
                          )}
                        />
                      )}
                    />
                  </div>

                  {/* Product/Service Name Field */}
                  <>
                    <div className='col-12 col-md-3  mb-3'>
                      <Controller
                        name='searchTerm'
                        control={form2.control}
                        defaultValue=''
                        // rules={{
                        //   required: 'searchTerm is required',
                        // }}
                        render={({ field }) => (
                          <Autocomplete
                            {...field}
                            freeSolo
                            options={searchTerm} // Array of objects with label and value
                            // getOptionLabel={searchTerm}
                            onInputChange={(event, value) => {
                              console.log(value); // For debugging
                              field.onChange(value || ''); // Ensure value is always a string
                              if (value.length > 2) {
                                debouncedSearchTerm(value); // Fetch suggestions
                              }
                            }}
                            onChange={(event, value) => {
                              console.log('changed', value); // For debugging
                              field.onChange(value || ''); // Store only the `value` string
                            }}
                            size='small'
                            fullWidth
                            // value={} // Map `field.value` back to the selected option
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label='Product / Service Name'
                                variant='outlined'
                                fullWidth
                                error={!!form2.formState.errors.searchTerm} // Show error if validation fails
                                helperText={
                                  form2.formState.errors.searchTerm?.message
                                } // Display error message
                              />
                            )}
                            renderOption={(props, option) => (
                              <li
                                key={option}
                                {...props}
                                // style={{
                                //   whiteSpace: 'nowrap', // Prevent text wrapping
                                //   overflow: 'hidden', // Hide overflow
                                //   textOverflow: 'ellipsis', // Add "..." if text is too long
                                //   minWidth: '300px', // Make dropdown wider
                                //   padding: '8px 12px', // Improve spacing
                                // }}
                              >
                                {option}
                              </li>
                            )}
                            // loading={setsearchLocation}
                            slotProps={{
                              popper: {
                                modifiers: [
                                  {
                                    name: 'preventOverflow',
                                    options: { boundary: 'window' },
                                  },
                                ],
                              },
                              paper: {
                                sx: {
                                  width: 'auto', // Adjust width based on content
                                  minWidth: 'max-content', // Ensures it doesn’t shrink to input width
                                  maxWidth: '800px', // Optional: Limit maximum width
                                },
                              },
                            }}
                          />
                        )}
                      />
                    </div>
                  </>
                  <div className=''></div>
                  {/* Submit Button */}
                  <div className='col-12 col-md-12'>
                    <button type='submit' className='search-btn search-btn1'>
                      Search
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div style={premisesCircleStyles.container}>
        <h2 style={premisesCircleStyles.title}>Popular Premises</h2>
        <div className='d-flex'>{loading && <Spinner />}</div>
        <div style={premisesCircleStyles.grid}>
          {premisesList.map((item) => (
            <div
              key={item.premises}
              style={premisesCircleStyles.circleWrapper}
              onClick={() => {
                switchToBusinessTab();
                if (item.address) {
                  const formattedValue = JSON.stringify(item.address);
                  const formattedLabel = Object.values(item.address)
                    .filter((x) => x != null)
                    .join(', ');

                  const newOption = {
                    label: formattedLabel,
                    value: formattedValue,
                  };

                  form2.setValue('address', formattedValue);
                  setLocationSuggestion((prev) => [...prev, newOption]);
                }
                form2.setValue('premises', item.premises);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  premisesCircleStyles.circleWrapperHover.transform;
                e.currentTarget.style.boxShadow =
                  premisesCircleStyles.circleWrapperHover.boxShadow;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={premisesCircleStyles.circle}>
                {
                  <img
                    src={item.image}
                    alt={item.premises}
                    style={premisesCircleStyles.circleImage}
                  />
                }
                {/* '/images/logo.webp' */}
              </div>
              <div style={premisesCircleStyles.premisesName}>
                {item.premises}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Container sx={{ py: 4 }}>
        <h2 style={premisesCircleStyles.title}>Popular Discounts</h2>
        <Grid container spacing={3}>
          {discounts.map((discount) => (
            <Grid item xs={12} sm={6} md={3} key={discount.id}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: 3,
                  height: '100%',
                  width: 250,
                }}
              >
                <CardActionArea
                  component='a'
                  href={discount.link}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <Box
                    sx={{
                      width: 250,
                      height: 200,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                    }}
                  >
                    <CardMedia
                      component='img'
                      image={discount.image}
                      alt={discount.title}
                      sx={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                        display: 'block',
                        margin: 'auto',
                      }}
                    />
                  </Box>
                  <CardContent sx={{ background: '#f5f5f5' }}>
                    <Typography
                      variant='p'
                      sx={{
                        fontWeight: 'bold',
                        color: 'green',
                        textAlign: 'left',
                      }}
                    >
                      {discount.title}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

const switchToBusinessTab = () => {
  const premisesTab = document.querySelector('#premises-tab');
  if (premisesTab) {
    premisesTab.click();
  }
};
export default LandingPage;

const premisesCircleStyles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
  },
  title: {
    textAlign: 'center',
    marginBottom: '3rem',
    color: '#333',
    fontSize: '2.5rem',
    fontWeight: 'bold',
  },
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '2rem',
    justifyContent: 'center',
    padding: '1rem',
  },
  circleWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  circleWrapperHover: {
    transform: 'translateY(-8px)',
  },
  circle: {
    width: '250px',
    height: '250px',
    borderRadius: '50%',
    overflow: 'hidden',
    border: '3px solid #3b4223',
    transition: 'border-color 0.3s ease',
  },
  circleImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  premisesName: {
    marginTop: '1rem',
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#3b4223',
    textAlign: 'center',
    letterSpacing: '0.5px',
    transition: 'color 0.3s ease',
  },
};
