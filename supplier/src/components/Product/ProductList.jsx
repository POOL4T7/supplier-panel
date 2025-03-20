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

const ProductList = () => {
  const [uploadedProducts, setUploadedProducts] = useState([]);
  const [supplier] = useAtom(userDetailsAtom);
  const [productValue, setProductValue] = useState('');
  const [brand, setBrand] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [price, setPrice] = useState('');
  const [addProductLoading, setAddProductLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bussiness] = useAtom(bussinessProfile);
  const [selectedRows, setSelectedRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [showAddButton, setShowAddButton] = useState(false);
  const [toggleUploadForm, setToggleUploadForm] = useState(false);
  const [fileUplaodStatus, setFileUplaodStatus] = useState(false);

  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState([]);

  // const [page, setPage] = useState(0);
  // const [pageSize, setPageSize] = useState(10);
  const [sortModel, setSortModel] = useState([
    {
      field: 'id',
      sort: 'DESC',
    },
  ]);
  const [totalRows, setTotalRows] = useState(0);
  const [filterModel, setFilterModel] = useState({
    productName: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
  });

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
      headerName: 'Product ID',
      width: 125,
      disableColumnMenu: true,
    },
    {
      field: 'productName',
      headerName: 'Name',
      width: 200,
      disableColumnMenu: true,
    },
    {
      field: 'brand',
      headerName: 'Brand',
      width: 130,
      disableColumnMenu: true,
    },
    {
      field: 'productDescription',
      headerName: 'Description',
      width: 200,
      disableColumnMenu: true,
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 110,
      disableColumnMenu: true,
    },
    {
      field: 'active',
      headerName: 'Status',
      width: 100,
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
      width: 100,
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
        formData.append('type', 'PRODUCT');
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
        setTotalRows(
          uploadedProducts?.length + res.data?.productDetailsList?.length
        );
      }
      setFileUplaodStatus(false);
      setFile(null);
      setFileData([]);
      setToggleUploadForm(false);
    } catch (e) {
      console.log(e);
      toast.error('File upload error');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!productValue || !price) return;
    setAddProductLoading(true);

    try {
      await axiosInstance.post(
        'proxy/productsearchsupplier/api/supplier/file/addProductsOrServices',
        {
          fileRowDataList: [
            {
              name: productValue,
              brand,
              description: productDescription,
              price: parseFloat(price),
            },
          ],
          supplierBusinessId: bussiness.id,
          type: 'PRODUCT',
          supplierId: supplier.id,
        }
      );

      // Reset form
      setProductValue('');
      setBrand('');
      setProductDescription('');
      setPrice('');
      setAddProductLoading(false);
      toast.success('Product added successfully');

      // Refresh the product list
      await fetchProducts();
    } catch (error) {
      console.log(error);
      toast.error('Error adding product');
      setAddProductLoading(false);
    }
  };

  const handleStatusChange = async (ids, status) => {
    try {
      await axiosInstance.post(
        `/proxy/productsearchsupplier/api/supplier/file/productservicestatus`,
        {
          productId: ids,
          supplierBusinessId: supplier.id,
          // serviceId: [101, 102, 103],
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
        `/proxy/productsearchsupplier/products/deleteProducts`,
        {
          supplierBusinessId: bussiness.id,
          productIds: [id],
        }
      );
      toast.success('Product deleted successfully');
      fetchProducts(); // Refresh the list after deletion
    } catch (error) {
      console.log(error);
      toast.error('Error deleting product');
    }
  };

  // const handleEdit = (row) => {
  //   // Implement edit functionality
  //   console.log('Edit row:', row);
  // };

  const fetchProducts = async () => {
    try {
      console.log('sortModel', sortModel);
      if (sortModel.length && sortModel[0]?.field == 'sno') {
        setUploadedProducts(uploadedProducts.reverse());
        return;
      }
      setLoading(true);
      // const filters = filterModel.items
      //   .map((item) => ({
      //     field: item.field,
      //     operator: item.operator.toUpperCase(),
      //     value: item.value,
      //   }))
      //   .filter((item) => item.value && item.value != '');

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
        `/proxy/productsearchsupplier/products/getAllProductDetails`,
        formData
      );

      setUploadedProducts(
        res.data.content?.map((item, idx) => ({
          sno: paginationModel.page * paginationModel.pageSize + idx + 1,
          ...item,
        }))
      );
      setTotalRows(res.data.totalElements);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bussiness.id) {
      fetchProducts();
    }
  }, [bussiness.id, paginationModel, sortModel]);

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) {
      toast.warning('No rows selected');
      return;
    }

    try {
      await axiosInstance.post(
        `/proxy/productsearchsupplier/products/deleteProducts`,
        {
          supplierBusinessId: bussiness.id,
          productIds: selectedRows,
        }
      );

      toast.success('Selected products deleted successfully');
      setSelectedRows([]);
      fetchProducts();
    } catch (error) {
      console.log(error);
      toast.error('Error deleting selected products');
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
        <Typography variant='h5'>Product List</Typography>
        <Box>
          <Button
            variant='outlined'
            component='span'
            sx={{
              // backgroundColor: '#355e3b',
              color: '#fff',
              // '&:hover': { backgroundColor: '#2a4a2f' },
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
                      <TableCell>Brand</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fileData.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.brand}</TableCell>
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
        <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3, backgroundColor: '#e2e3df' }}>
          <Typography variant='h6' mb={2}>
            Create Product
          </Typography>
          <form onSubmit={handleAddProduct}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={5}>
                <TextField
                  fullWidth
                  label='Brand'
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  size='small'
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  fullWidth
                  label='Product Name'
                  value={productValue}
                  onChange={(e) => setProductValue(e.target.value)}
                  required
                  size='small'
                />
              </Grid>
              <Grid item xs={12} sm={2}>
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
        </Paper>
      )}

      <Paper
        sx={{ height: 'auto', width: '100%', backgroundColor: '#e2e3df', p: 2 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant='h6' sx={{ mb: 2 }}></Typography>

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
              label='Product Name'
              value={filterModel.productName || ''}
              onChange={(e) =>
                setFilterModel({ ...filterModel, productName: e.target.value })
              }
              size='small'
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label='Brand'
              value={filterModel.brand || ''}
              onChange={(e) =>
                setFilterModel({ ...filterModel, brand: e.target.value })
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
              // backgroundColor: '#e0e2da',
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

export default ProductList;
