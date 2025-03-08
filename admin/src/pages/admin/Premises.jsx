import axiosInstance from '../../axios';
import { useEffect, useState } from 'react';
import {
  Modal,
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

const Premises = () => {
  const [premisesList, setPremisesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const { control, handleSubmit, reset, setValue, getValues } = useForm({
    defaultValues: {
      country: 'Germany',
      premisesName: '',
      street: '',
      houseNo: '',
      area: '',
      zipCode: '',
      city: '',
      displayOrder: '',
      premisesImage: null,
      premisesId: null,
    },
  });

  const loadPremises = async (country) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        `/proxy/productsearchadmin/api/admin/premises/getPremises?country=${country}`
      );
      setPremisesList(res.data);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPremises('Germany');
  }, []);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    reset();
    setImagePreview(null);
  };

  const onSubmit = async (data) => {
    console.log(data);
    data.id = data.premisesId;
    try {
      const res = await axiosInstance.post(
        '/proxy/productsearchadmin/api/admin/premises/save',
        data
      );
      await loadPremises(data.country);
      console.log(res.data);
    } catch (e) {
      console.log(e);
    }
    handleCloseModal();
  };

  const handleFileChange = async (e) => {
    try {
      const file = e.target.files[0];
      // setValue('image', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      const res = await axiosInstance.post(
        `/proxy/productsearchadmin/api/admin/premises/uploadPremisesImage`,
        { premisesImage: file, premisesId: getValues('premisesId') },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setValue('premisesImage', res.data.premisesImagePath);
      console.log(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  if (loading) {
    return (
      <div className='d-flex justify-content-center'>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div>
      <h1>Premises List</h1>
      <div className='row'>
        <div className='col-4'>
          <Controller
            name='country'
            control={control}
            render={({ field }) => (
              <FormControl fullWidth margin='dense' size='small'>
                <InputLabel>Country</InputLabel>
                <Select
                  {...field}
                  label='Country'
                  onChange={(e) => {
                    field.onChange(e);
                    loadPremises(e.target.value || 'Germany');
                  }}
                >
                  <MenuItem value='Germany'>Germany</MenuItem>
                  <MenuItem value='France'>France</MenuItem>
                  <MenuItem value='USA'>USA</MenuItem>
                  <MenuItem value='India'>India</MenuItem>
                  <MenuItem value='UK'>UK</MenuItem>
                  <MenuItem value='Canada'>Canada</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </div>
      </div>
      <div className='d-flex flex-wrap'>
        {premisesList.map((premises, index) => (
          <div
            key={index}
            className='p-2'
            onClick={(e) => {
              e.preventDefault();
              setValue('country', premises.address.country);
              setValue('premisesName', premises.premisesName);
              setValue('street', premises.address.street);
              setValue('houseNo', premises.address.houseNo);
              setValue('area', premises.address.area);
              setValue('zipCode', premises.address.zipCode);
              setValue('city', premises.address.city);
              setValue('displayOrder', premises.displayOrder);
              setValue('premisesImage', premises.premisesImagePath);
              setValue('premisesId', premises.premisesId);
              setShowModal(true);
            }}
          >
            <div
              style={{
                width: '200px',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '50%',
                // backgroundColor: '#b7b9b1',
                cursor: 'pointer',
                border: '3px solid #3b4223',
              }}
            >
              <img
                src={premises.premisesImagePath || '/images/logo.webp'}
                alt={premises.premisesName}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50%',
                }}
              />
            </div>
            <div className='d-flex justify-content-center'>
              <p>{premises.premisesName}</p>
            </div>
          </div>
        ))}
        <div className='p-2'>
          <div
            className='d-flex justify-content-center align-items-center'
            style={{
              width: '200px',
              height: '200px',
              objectFit: 'cover',
              borderRadius: '50%',
              backgroundColor: '#b7b9b1',
              cursor: 'pointer',
            }}
            onClick={handleShowModal}
          >
            Add New Premises
          </div>
        </div>
      </div>

      <Modal open={showModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            maxHeight: '90vh',
            overflowY: 'auto',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant='h6' component='h2'>
            {getValues('premisesId') ? 'Update' : 'Add New'} Premises
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            {getValues('premisesId') ? (
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  id='image-upload'
                />
                <label htmlFor='image-upload'>
                  <div
                    style={{
                      width: '100px',
                      height: '100px',
                      border: '1px dashed #ccc',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      display: 'inline-block',
                    }}
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt='Preview'
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <Typography variant='body2' color='textSecondary'>
                        Upload Image
                      </Typography>
                    )}
                  </div>
                </label>
              </div>
            ) : (
              <></>
            )}

            <Controller
              name='premisesName'
              control={control}
              rules={{ required: 'Premises Name is required' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  margin='dense'
                  fullWidth
                  size='small'
                  label='Premises Name'
                  error={!!error}
                  helperText={error ? error.message : null}
                />
              )}
            />
            <Controller
              name='street'
              control={control}
              rules={{ required: 'Street Name is required' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  margin='dense'
                  fullWidth
                  size='small'
                  label='Street Name'
                  error={!!error}
                  helperText={error ? error.message : null}
                />
              )}
            />
            <Controller
              name='houseNo'
              control={control}
              rules={{ required: 'House No is required' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  margin='dense'
                  fullWidth
                  size='small'
                  label='House No'
                  error={!!error}
                  helperText={error ? error.message : null}
                />
              )}
            />
            <Controller
              name='area'
              control={control}
              rules={{ required: 'Area is required' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  margin='dense'
                  fullWidth
                  size='small'
                  label='Area'
                  error={!!error}
                  helperText={error ? error.message : null}
                />
              )}
            />
            <Controller
              name='zipCode'
              control={control}
              rules={{ required: 'Zip Code is required' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  margin='dense'
                  fullWidth
                  size='small'
                  label='Zip Code'
                  error={!!error}
                  helperText={error ? error.message : null}
                />
              )}
            />
            <Controller
              name='city'
              control={control}
              rules={{ required: 'City is required' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  margin='dense'
                  fullWidth
                  size='small'
                  label='City'
                  error={!!error}
                  helperText={error ? error.message : null}
                />
              )}
            />
            <Controller
              name='displayOrder'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin='dense'
                  fullWidth
                  size='small'
                  label='Display Order'
                  type='number'
                />
              )}
            />
            <Button type='submit' variant='contained' color='primary'>
              Submit
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default Premises;
