import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
// import Spinner from '../components/common/Spinner';
// import LocationIcon from '../components/common/LocationIcon';
import { Autocomplete, TextField } from '@mui/material';
// import CircularProgress from '@mui/material/CircularProgress';

import { useNavigate } from 'react-router-dom';
import Spinner from '../components/common/Spinner';
const formSchema = yup.object().shape({
  // country: yup.string().required("country is required"),
  address: yup.string().required('location is required'),
  searchTerm: yup.string().optional(),
});

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
        const res = await axios.post(
          '/proxy/productsearchsupplier/premisesListing'
        );

        setPremisesList(res.data);
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
      //   `/proxy/productsearchsupplier/search`,
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
      //   `/proxy/productsearchsupplier/search`,
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
      const res = await axios.post(
        `/proxy/productsearchsupplier/locationSuggestions`,
        {
          country: localStorage.getItem('country') || 'germany',
          location: inputValue,
        }
      );

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
        `/proxy/productsearchsupplier/premisesOrShopSuggestions`,
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
      // productsearchsupplier/searchTermSuggestions
      const res = await axios.post(
        '/proxy/productsearchsupplier/searchTermSuggestions',
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
        `/proxy/productsearchsupplier/premisesOrShopSuggestions`,
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

  const buildImage = (base64String) => {
    try {
      // Check if the string is empty or undefined
      if (!base64String) {
        return null;
      }

      // If the string already starts with 'data:', return as is
      if (base64String.startsWith('data:')) {
        return base64String;
      }

      // Create a complete data URL by adding the prefix
      const imageUrl = `data:image/jpeg;base64,${base64String}`;
      return imageUrl;
    } catch (error) {
      console.error('Error creating image URL:', error);
      return null;
    }
  };
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
                      // defaultValue=''
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
                          onInputChange={(event, value) => {
                            field.onChange(value || '');
                            if (value.length > 2) {
                              debouncedInputChange(value);
                            }
                          }}
                          onChange={(event, value) => {
                            field.onChange(value?.value || '');
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
                                minWidth: '300px', // Ensures dropdown is wider
                              },
                            },
                          }}
                          renderOption={(props, option) => (
                            <li
                              {...props}
                              style={{
                                whiteSpace: 'nowrap', // Prevent text wrapping
                                overflow: 'hidden', // Hide overflow
                                textOverflow: 'ellipsis', // Add "..." if text is too long
                                minWidth: '300px', // Make dropdown wider
                                padding: '8px 12px', // Improve spacing
                              }}
                            >
                              {option.label}
                            </li>
                          )}
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
                                minWidth: '300px', // Ensures dropdown is wider
                              },
                            },
                          }}
                          renderOption={(props, option) => (
                            <li
                              {...props}
                              key={option.premisesName}
                              style={{
                                whiteSpace: 'nowrap', // Prevent text wrapping
                                overflow: 'hidden', // Hide overflow
                                textOverflow: 'ellipsis', // Add "..." if text is too long
                                minWidth: '300px', // Make dropdown wider
                                padding: '8px 12px', // Improve spacing
                              }}
                            >
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
                                minWidth: '300px', // Ensures dropdown is wider
                              },
                            },
                          }}
                          renderOption={(props, option) => (
                            <li
                              {...props}
                              key={option.shopOrBusinessName}
                              style={{
                                whiteSpace: 'nowrap', // Prevent text wrapping
                                overflow: 'hidden', // Hide overflow
                                textOverflow: 'ellipsis', // Add "..." if text is too long
                                minWidth: '300px', // Make dropdown wider
                                padding: '8px 12px', // Improve spacing
                              }}
                            >
                              <div>
                                <strong>{option.shopOrBusinessName}</strong>
                                <div
                                  style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '4px',
                                    marginTop: '4px',
                                  }}
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
                                style={{
                                  whiteSpace: 'nowrap', // Prevent text wrapping
                                  overflow: 'hidden', // Hide overflow
                                  textOverflow: 'ellipsis', // Add "..." if text is too long
                                  minWidth: '300px', // Make dropdown wider
                                  padding: '8px 12px', // Improve spacing
                                }}
                              >
                                {option}
                              </li>
                            )}
                            // loading={setsearchLocation}
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
          {premisesList.map((item) => {
            return (
              <div
                key={item.premises}
                onClick={() => {
                  switchToBusinessTab();
                  if (item.address) {
                    setLocationSuggestion([
                      {
                        label: Object.values(item.address)
                          .filter((x) => x != null)
                          .join(', '),
                        value: JSON.stringify(item.address),
                      },
                    ]);
                    form2.setValue('address', JSON.stringify(item.address));
                  }
                  form2.setValue('premises', item.premises);
                }}
                style={{
                  ...premisesCircleStyles.circle,
                  // ...(isHovered ? premisesCircleStyles.circleHover : {}),
                }}
                // onMouseEnter={() => setIsHovered(true)}
                // onMouseLeave={() => setIsHovered(false)}
              >
                {item.image && (
                  <img
                    src={buildImage(item.image)}
                    alt={item.premises}
                    style={premisesCircleStyles.circleImage}
                  />
                )}
                <div style={premisesCircleStyles.premisesName}>
                  {item.premises}
                </div>
              </div>
            );
          })}
        </div>
      </div>
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
  circle: {
    position: 'relative',
    width: '220px',
    height: '220px',
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    border: '2px solid #e0e0e0',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  circleHover: {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    borderColor: '#355e3b',
  },
  circleImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  premisesName: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '15px 10px',
    backgroundColor: '#e0e2da',
    color: 'rgb(59 66 35)',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 0,
  },
};
