import axiosInstance from '../../axios';
import { useState } from 'react';
import { userDetailsAtom } from '../../storges/user';
import { useAtom } from 'jotai';
import { toast } from 'react-toastify';

const ProductTransfer = () => {
  const [uploadedProducts, setUploadedProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [movedProducts, setMovedProducts] = useState([]);
  const [isLeftSelected, setIsLeftSelected] = useState(false);
  const [isRightSelected, setIsRightSelected] = useState(false);
  const [supplier] = useAtom(userDetailsAtom);
  const [productValue, setProductValue] = useState('');

  const handleFileUpload = async (event) => {
    try {
      const file = event.target.files[0];
      const formData = new FormData();

      if (file) {
        formData.append('file', file);
        formData.append('supplierId', supplier.id);
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
      }
    } catch (e) {
      console.log(e);
      toast.error('file uplaod error');
    }
  };

  const toggleSelectProduct = (product, type) => {
    if (type === 'left') {
      setIsLeftSelected(false);
      setIsRightSelected(true);
    } else {
      setIsLeftSelected(true);
      setIsRightSelected(false);
    }
    setSelectedProducts((prevSelected) => {
      const newTemp = prevSelected.includes(product)
        ? prevSelected.filter((p) => p !== product)
        : [...prevSelected, product];
      if (newTemp.length == 0) {
        setIsLeftSelected(false);
        setIsRightSelected(false);
      }
      return newTemp;
    });
  };

  const moveToRight = () => {
    setMovedProducts((prev) => [...prev, ...selectedProducts]);
    setUploadedProducts((prev) =>
      prev.filter((p) => !selectedProducts.includes(p))
    );
    setSelectedProducts([]);
    setIsRightSelected(false);
  };

  const moveToLeft = () => {
    setUploadedProducts((prev) => [...prev, ...selectedProducts]);
    setMovedProducts((prev) =>
      prev.filter((p) => !selectedProducts.includes(p))
    );
    setSelectedProducts([]);
    setIsLeftSelected(false);
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!productValue) return;
    const [productName, description] = productValue.split(',');
    if (!productName || !description) {
      toast.error('Please upload product in correct format');
      return;
    }
    setUploadedProducts([
      ...uploadedProducts,
      { id: 1, productName, description },
    ]);
    setProductValue('');
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        supplierBusinessId: supplier.id,
        productId: movedProducts.map((item) => item.id),
        status: true,
      };
      const res = await axiosInstance.post(
        '/proxyproductsearchsupplier/api/supplier/file/productservicestatus',
        data
      );
      console.log(res);
      toast.success(res.data.message);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className='container'>
      <div className='mb-3'>
        <div className='d-flex justify-content-between mb-2'>
          <h3>Upload Product File</h3>
          <button
            className='btn btn-primary mt-2'
            onClick={submit}
            disabled={!movedProducts.length}
          >
            Update
          </button>
        </div>
        <input
          type='file'
          className='form-control'
          onChange={handleFileUpload}
        />
      </div>
      <form>
        <div className='row'>
          <div className='col-10'>
            <div className='mb-2'>
              <input
                type='text'
                value={productValue}
                className={`form-control`}
                onChange={(e) => setProductValue(e.target.value)}
              />
            </div>
          </div>
          <div className='col-2'>
            <button className=' btn btn-primary ' onClick={handleAddProduct}>
              Add
            </button>
          </div>
        </div>
      </form>
      <div
        className='row align-items-center justify-content-between'
        style={{ maxHeight: '80vh', height: '100%' }}
      >
        <div
          className='col-md-5 border p-3'
          style={{ height: '60vh', overflow: 'scroll' }}
        >
          <h5 className='mb-3'>Uploaded Product</h5>

          {uploadedProducts.length > 0 ? (
            uploadedProducts.map((product) => (
              <div key={product.id} className='form-check mb-2'>
                <input
                  type='checkbox'
                  className='form-check-input'
                  id={`uploaded-${product.id}`}
                  checked={selectedProducts.includes(product)}
                  onChange={() => toggleSelectProduct(product, 'left')}
                />
                <label
                  className='form-check-label'
                  htmlFor={`uploaded-${product.id}`}
                >
                  {product.productName}
                </label>
              </div>
            ))
          ) : (
            <p className='text-muted'>No products uploaded.</p>
          )}
        </div>

        <div className='col-md-2 d-flex flex-column align-items-center'>
          <button
            className='btn btn-primary mb-2'
            onClick={moveToRight}
            disabled={!isRightSelected}
          >
            &gt;&gt;
          </button>
          <button
            className='btn btn-primary'
            onClick={moveToLeft}
            disabled={!isLeftSelected}
          >
            &lt;&lt;
          </button>
        </div>

        <div
          className='col-md-5 border pt-3'
          style={{ height: '60vh', overflow: 'scroll' }}
        >
          <h5 className='mb-3'>Selected Product</h5>
          {movedProducts.length > 0 ? (
            movedProducts.map((product) => (
              <div key={product.id} className='form-check mb-2'>
                <input
                  type='checkbox'
                  className='form-check-input'
                  id={`moved-${product.id}`}
                  checked={selectedProducts.includes(product)}
                  onChange={() => toggleSelectProduct(product, 'right')}
                />
                <label
                  className='form-check-label'
                  htmlFor={`moved-${product.id}`}
                >
                  {product.productName}
                </label>
              </div>
            ))
          ) : (
            <p className='text-muted'>No products selected.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductTransfer;
