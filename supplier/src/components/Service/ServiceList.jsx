import axiosInstance from '../../axios';
import { useEffect, useState } from 'react';
import { bussinessProfile, userDetailsAtom } from '../../storges/user';
import { useAtom } from 'jotai';
import { toast } from 'react-toastify';
import Spinner from '../common/Spinner';
import { DataGrid } from '@mui/x-data-grid';
import {
  Box,
  Paper,
  TextField,
  Switch,
  IconButton,
  Button,
  Grid,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { FilePlus2, Trash, X as CancelButton, Upload } from 'lucide-react';

const ServiceList = () => {
  const [uploadedProducts, setUploadedProducts] = useState([]);
  const [supplier] = useAtom(userDetailsAtom);
  const [productValue, setProductValue] = useState('');
  const [price, setPrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [addProductLoading, setAddProductLoading] = useState(false);

  const [bussiness] = useAtom(bussinessProfile);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);

  const [sortModel, setSortModel] = useState([
    {
      field: 'id',
      sort: 'DESC',
    },
  ]);
  const [totalRows, setTotalRows] = useState(0);
  const [filterModel, setFilterModel] = useState({ items: [] });
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [showAddButton, setShowAddButton] = useState(false);
  const [toggleUploadForm, setToggleUploadForm] = useState(false);
  const [fileUplaodStatus, setFileUplaodStatus] = useState(false);

  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState([]);
  const columns = [
    {
      field: 'sno',
      headerName: 'S.No',
      width: 70,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'id',
      headerName: 'Service ID',
      flex: 1,
      disableColumnMenu: true,
    },
    {
      field: 'serviceName',
      headerName: 'Name',
      flex: 1,
      disableColumnMenu: true,
    },

    {
      field: 'serviceDescription',
      headerName: 'Description',
      flex: 1,
      disableColumnMenu: true,
    },
    {
      field: 'price',
      headerName: 'Price',
      flex: 1,
      disableColumnMenu: true,
    },
    {
      field: 'active',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => (
        <Switch
          checked={params.row.active}
          onChange={() => {
            return handleStatusChange([params.row.id], params.row.active);
          }}
        />
      ),
      disableColumnMenu: true,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* <IconButton onClick={() => handleEdit(params.row)} color='primary'>
            <Pencil size={18} />
          </IconButton> */}
          <IconButton onClick={() => handleDelete(params.row.id)} color='error'>
            <Trash size={18} />
          </IconButton>
        </Box>
      ),
      disableColumnMenu: true,
      sortable: false,
    },
  ];

  const handleFileUpload = async (e) => {
    try {
      e.preventDefault();
      const formData = new FormData();
      setFileUplaodStatus(true);
      if (file) {
        formData.append('file', file);
        formData.append('supplierId', supplier.id);
        formData.append('supplierBusinessId', bussiness.id);
        formData.append('type', 'SERVICE');
        const res = await axiosInstance.post(
          '/proxy/productsearchsupplier/api/supplier/file/uploadSupplierBusinessDetails',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        toast.success(res.data.message);
        setUploadedProducts([
          ...uploadedProducts,
          ...(res.data?.productDetailsList || []),
        ]);
      }
      setFileUplaodStatus(false);
      setFile(null);
      setFileData([]);
      setToggleUploadForm(false);
    } catch (e) {
      console.log(e);
      toast.error('file uplaod error');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!productValue) return;
    setAddProductLoading(true);
    await axiosInstance.post(
      'proxy/productsearchsupplier/api/supplier/file/addProductsOrServices',
      {
        fileRowDataList: [
          {
            name: productValue,

            description: productDescription,
            price: price,
          },
        ],
        supplierBusinessId: bussiness.id,
        type: 'SERVICE',
        supplierId: supplier.id,
      }
    );

    setProductValue('');
    setPrice('');
    setProductDescription('');
    setAddProductLoading(false);
    await fetchProducts();
  };

  const handleStatusChange = async (ids, status) => {
    try {
      await axiosInstance.post(
        `/proxy/productsearchsupplier/api/supplier/file/productservicestatus`,
        {
          supplierBusinessId: supplier.id,
          serviceId: ids,
          status: !status,
        }
      );
      toast.success('Status updated successfully');
      fetchProducts(); // Refresh the list after status change
    } catch (error) {
      console.log(error);
      toast.error('Error updating status');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.post(
        `/proxy/productsearchsupplier/services/deleteServices`,
        {
          supplierBusinessId: bussiness.id,
          serviceIds: [id],
        }
      );
      toast.success('service deleted successfully');
      fetchProducts(); // Refresh the list after deletion
    } catch (error) {
      console.log(error);
      toast.error('Error deleting service');
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const filters = Object.keys(filterModel)
        .map((key) => {
          return {
            field: key,
            value: filterModel[key],
            operator: 'LIKE',
          };
        })
        .filter((item) => item.value && item.value != '');

      const formData = {
        supplierBusinessId: bussiness.id,
        pageNo: paginationModel.page,
        noOfEvents: paginationModel.pageSize,
        filters: filters,
        specificationsRequired: true,
        sort: sortModel.map((item) => ({
          field: item.field,
          direction: item.sort.toUpperCase() || 'ASC',
        })),
      };

      const res = await axiosInstance.post(
        `/proxy/productsearchsupplier/services/getAllServiceDetails`,
        formData
      );

      setUploadedProducts(
        res.data.content?.map((item, idx) => ({ sno: idx + 1, ...item }))
      );
      setTotalRows(res.data.totalElements);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  // const submit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const data = {
  //       supplierBusinessId: bussiness.id,
  //       serviceId: movedProducts.map((item) => item.id),
  //       status: true,
  //       supplierId: supplier.id,
  //     };
  //     const res = await axiosInstance.post(
  //       '/proxy/productsearchsupplier/api/supplier/file/productservicestatus',
  //       data
  //     );
  //     console.log(res);
  //     toast.success(res.data.message);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  useEffect(() => {
    if (bussiness.id) {
      fetchProducts();
    }
  }, [bussiness.id, paginationModel.page, paginationModel.pageSize, sortModel]);

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) {
      toast.warning('No rows selected');
      return;
    }

    try {
      await axiosInstance.post(
        `/proxy/productsearchsupplier/services/deleteServices`,
        {
          supplierBusinessId: bussiness.id,
          serviceIds: selectedRows,
        }
      );
      toast.success('Selected services deleted successfully');
      setSelectedRows([]);
      fetchProducts();
    } catch (error) {
      console.log(error);
      toast.error('Error deleting selected services');
    }
  };

  // Handle Bulk Status Update
  // const handleBulkStatusUpdate = async () => {
  //   if (selectedRows.length === 0) {
  //     toast.warning('No rows selected');
  //     return;
  //   }

  //   try {
  //     await axiosInstance.post(
  //       `/proxy/productsearchsupplier/api/supplier/file/productservicestatus`,
  //       {
  //         productId: selectedRows,
  //         supplierBusinessId: supplier.id,
  //         status: true, // Set status to true for selected products
  //       }
  //     );
  //     toast.success('Selected products status updated successfully');
  //     fetchProducts();
  //   } catch (error) {
  //     console.log(error);
  //     toast.error('Error updating status');
  //   }
  // };

  const readFile = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      setFile(file);

      const reader = new FileReader();

      reader.onload = (event) => {
        const text = event.target.result;
        const rows = text.trim().split('\n');

        const products = rows.map((row) => {
          const [name, brand, description, price] = row.split(',');
          return {
            name: name?.trim(),
            brand: brand?.trim(),
            description: description?.trim(),
            price: parseFloat(price?.trim()) || 0,
          };
        });

        setFileData(products);
      };

      reader.readAsText(file);
    } catch (error) {
      console.error('Error reading file:', error);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          mb: 2,
        }}
      >
        <Typography variant='h5'>Add Service</Typography>
        <Box>
          <Button
            variant='outlined'
            component='span'
            sx={{
              color: '#fff',
              marginRight: 2,
            }}
            onClick={() => setShowAddButton(!showAddButton)}
          >
            {showAddButton ? (
              <CancelButton color='red' />
            ) : (
              <FilePlus2 color='#355e3b' />
            )}
          </Button>
          <label htmlFor='file-upload'>
            {/* <input
              id='file-upload'
              type='file'
              hidden
              onChange={handleFileUpload}
              accept='.txt'
            /> */}
            <Button
              variant='outlined'
              component='span'
              sx={{
                color: '#fff',
              }}
              onClick={() => setToggleUploadForm(!toggleUploadForm)}
            >
              {toggleUploadForm ? (
                <CancelButton color='red' />
              ) : (
                <>
                  <Upload style={{ marginRight: '4px' }} color='#355e3b' />{' '}
                </>
              )}
            </Button>
          </label>
        </Box>
      </Box>
      {toggleUploadForm && (
        <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3, backgroundColor: '#e2e3df' }}>
          <Typography variant='h6'>Bulk Upload</Typography>
          <input
            // id='file-upload'
            type='file'
            onChange={readFile}
            accept='.txt'
            className='form-control'
            style={{
              maxWidth: '400px',
            }}
          />
          {file && (
            <Box mt={2}>
              <Typography variant='body1'>File Name: {file.name}</Typography>
            </Box>
          )}

          {fileData && fileData.length > 0 && (
            <Box mt={2}>
              <Typography variant='h6'>Extracted Data:</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fileData.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.description}</TableCell>
                        <TableCell>{product.price}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
          <Box mt={3} display='flex' justifyContent='flex-end'>
            {/* <Button
              variant='contained'
              sx={{
                marginRight: '2px',
              }}
              color='error'
              onClick={() => {
                setFile(null);
                setFileData([]);
              }}
            >
              Cancel
            </Button> */}
            <Button
              variant='contained'
              sx={{
                backgroundColor: '#355e3b',
                color: '#fff',
                '&:hover': { backgroundColor: '#2a4a2f' },
              }}
              onClick={handleFileUpload}
              disabled={fileData.length === 0}
            >
              {fileUplaodStatus && <Spinner width='15px' height='15px' />}{' '}
              Upload
            </Button>
          </Box>
        </Paper>
      )}
      {showAddButton && (
        <form onSubmit={handleAddProduct}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Service Name'
                value={productValue}
                onChange={(e) => setProductValue(e.target.value)}
                required
                size='small'
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Price'
                type='number'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                size='small'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Description'
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                size='small'
                multiline
                rows={2}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
            >
              <Button
                type='submit'
                variant='contained'
                disabled={addProductLoading}
                sx={{
                  backgroundColor: '#355e3b',
                  color: '#fff',
                  height: '40px',
                  width: '100%',
                  maxWidth: '150px',
                  '&:hover': { backgroundColor: '#2a4a2f' },
                }}
              >
                {addProductLoading ? (
                  <Spinner width='20px' height='20px' />
                ) : (
                  'Add'
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      )}

      <Paper
        sx={{ height: 'auto', width: '100%', backgroundColor: '#e2e3df', p: 2 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant='h6' sx={{ mb: 2 }}>
            Service List
          </Typography>

          {/* Bulk Actions */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Button
              variant='contained'
              onClick={() => {
                handleStatusChange(selectedRows, false);
              }}
              disabled={selectedRows.length === 0}
              sx={{
                backgroundColor: '#355e3b',
                color: '#fff',
                '&:hover': { backgroundColor: '#2a4a2f' },
              }}
            >
              Active Selected
            </Button>
            <Button
              variant='contained'
              color='default'
              onClick={() => {
                handleStatusChange(selectedRows, true);
              }}
              disabled={selectedRows.length === 0}
            >
              Inactive Selected
            </Button>
            <Button
              variant='contained'
              color='error'
              onClick={handleBulkDelete}
              disabled={selectedRows.length === 0}
            >
              Delete Selected
            </Button>
            {/* <Button
              variant='outlined'
              color='primary'
              onClick={handleBulkStatusUpdate}
              disabled={selectedRows.length === 0}
            >
              Update Status
            </Button> */}
          </Box>
        </Box>
        <Grid container spacing={2} alignItems='center' sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label='Service Name'
              value={filterModel.serviceName || ''}
              onChange={(e) =>
                setFilterModel({ ...filterModel, serviceName: e.target.value })
              }
              size='small'
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label='Price (Min)'
              type='number'
              value={filterModel.minPrice || ''}
              onChange={(e) =>
                setFilterModel({ ...filterModel, minPrice: e.target.value })
              }
              size='small'
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label='Price (Max)'
              type='number'
              value={filterModel.maxPrice || ''}
              onChange={(e) =>
                setFilterModel({ ...filterModel, maxPrice: e.target.value })
              }
              size='small'
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={2}
            sx={{ display: 'flex', justifyContent: 'center' }}
          >
            <Button
              variant='contained'
              color='primary'
              onClick={fetchProducts}
              sx={{
                backgroundColor: '#355e3b',
                color: '#fff',
                height: '40px',
                width: '100%',
                maxWidth: '150px',
                '&:hover': { backgroundColor: '#2a4a2f' },
              }}
            >
              Apply Filters
            </Button>
          </Grid>
        </Grid>

        <DataGrid
          rows={uploadedProducts}
          columns={columns}
          pagination
          checkboxSelection
          paginationMode='server'
          sortingMode='server'
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          rowCount={totalRows}
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          loading={loading}
          onRowSelectionModelChange={setSelectedRows}
          pageSizeOptions={[10, 25, 50, 100]}
          componentsProps={{
            loadingOverlay: {
              style: { backgroundColor: '#e2e3df' },
            },
          }}
          sx={{
            border: 0,
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: '#e0e2da',
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: '700',
            },
            '& .MuiDataGrid-cell:hover': {
              backgroundColor: '#dbdcd7',
            },
            '& .MuiDataGrid-cell:focus': {
              outline: 'none',
            },
            '& .MuiDataGrid-overlay': {
              backgroundColor: '#e0e2da',
            },
          }}
        />
      </Paper>
    </Box>
  );
};

export default ServiceList;
