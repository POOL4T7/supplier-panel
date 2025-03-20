import { useEffect, useState } from 'react';
import axiosInstance from '../../../axios';
import { useAtom } from 'jotai';
import { bussinessProfile, userDetailsAtom } from '../../../storges/user';

const debounceFetch = (func, delay) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const ProductShop = () => {
  const [supplier] = useAtom(userDetailsAtom);
  const [bussiness] = useAtom(bussinessProfile);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [listData, setListData] = useState([]);
  const [descriptionList, setDescriptionList] = useState([]);

  const handleInputChange = async (inputValue) => {
    setDescription(inputValue);
    try {
      const res = await axiosInstance.get(
        `/proxy/productsearchsupplier/getAllBusinessDescription?description=${inputValue}&type=products`
      );
      console.log(res);
      setListData(
        res.data.map((item) => ({
          id: item.id,
          name: item.description,
          type: 'description',
        }))
      );
      //   setDescriptionList(
      //     res.data.map((item) => ({
      //       id: item.id,
      //       name: item.description,
      //     }))
      //   );
    } catch (error) {
      console.error('Error fetching business descriptions:', error);
    }
  };

  const createDescription = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(
        '/proxy/productsearchsupplier/api/supplier/file/addSupplierBusinessDescription',
        {
          supplierBusinessId: bussiness.id,
          supplierBusinessDescription: description,
          type: 'products',
        }
      );
      setListData([
        {
          id: description,
          name: description,
          type: 'description',
        },
      ]);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchCategories = async () => {
    try {
      //   setLoading(true);
      const res = await axiosInstance.get(
        `/proxy/productsearchsupplier/getBusinessDescriptionByType?type=products&supplierBusinessId=${bussiness.id}`
      );
      setDescriptionList(res.data); // string[]
      //   const res2 = await axiosInstance.get(
      //     `/proxy/productsearchsupplier/getSupplierCategoriesForStructured?type=products&supplierBusinessId=${bussiness.id}`
      //   );
      //   console.log(res2);
      console.log(res);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    if (bussiness?.id) fetchCategories();
  }, [bussiness.id]);

  const handleDescriptionChange = debounceFetch(handleInputChange, 500);

  return (
    <div className='mt-3'>
      <div className='row'>
        <div className='col-12 col-md-6'>
          <div className='col-12'>
            <h2>Create Shop</h2>
          </div>
          <div className='row align-items-end g-2'>
            <div className='col-8 col-md-10'>
              <div className='mb-2'>
                <label className='form-label'>Business Description</label>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Enter description'
                  value={description}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                />
                <div className='invalid-feedback'>
                  Please provide a valid description.
                </div>
              </div>
            </div>
            <div className='col-4 col-md-2 d-flex justify-content-end'>
              <button
                className='btn btn-primary w-100'
                onClick={createDescription}
              >
                Add
              </button>
            </div>
            {descriptionList.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <div className='row align-items-end g-2'>
            <div className='col-8 col-md-10'>
              <div className='mb-2'>
                <label className='form-label'>Category</label>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Enter category'
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={!description}
                  value={category}
                />
                <div className='invalid-feedback'>
                  Please provide a valid description.
                </div>
              </div>
            </div>
            <div className='col-4 col-md-2 d-flex justify-content-end'>
              <button className='btn btn-primary w-100'>Add</button>
            </div>
          </div>
          <div className='row align-items-end g-2'>
            <div className='col-8 col-md-10'>
              <div className='mb-2'>
                <label className='form-label'>Sub Category</label>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Enter sub category'
                  onChange={(e) => setSubCategory(e.target.value)}
                  disabled={!category}
                  value={subCategory}
                />
                <div className='invalid-feedback'>
                  Please provide a valid description.
                </div>
              </div>
            </div>
            <div className='col-4 col-md-2 d-flex justify-content-end'>
              <button className='btn btn-primary w-100'>Add</button>
            </div>
          </div>
          <div
            className='border p-3 mt-2'
            style={{
              height: '50vh',
              overflowY: 'scroll',
              position: 'relative',
            }}
          >
            {listData?.map((product) => (
              <div key={product.id} className='form-check mb-2'>
                <input
                  type='checkbox'
                  className='form-check-input'
                  //   checked={selectedSubCategories.includes(product)}
                  //   onChange={() => toggleSelectProduct(product, 'left')}
                />
                <label className='form-check-label'>{product.name}</label>
              </div>
            ))}
            <div style={{ position: 'absolute', bottom: '5px', right: '5px' }}>
              <button className='btn btn-outline-danger m-2'>Cancel</button>
              <button className='btn btn-primary'>Update</button>
            </div>
          </div>
        </div>
        <div className='col-12 col-md-6 mt-4 mt-md-0'>
          <div className='row'>
            <div className='col-12'>
              <h2>Your Shop</h2>
            </div>
          </div>

          <div className='accordion' id='categoryAccordion'>
            {[].map((desc, idx) => (
              <div className='accordion-item' key={desc.businessDescription}>
                <h2 className='accordion-header' id={`heading${idx}`}>
                  <button
                    className='accordion-button'
                    type='button'
                    data-bs-toggle='collapse'
                    data-bs-target={`#collapse${idx}`}
                    aria-expanded='true'
                    aria-controls={`collapse${idx}`}
                  >
                    {desc.businessDescription}
                  </button>
                </h2>
                <div
                  id={`collapse${idx}`}
                  className='accordion-collapse collapse'
                  aria-labelledby={`heading${idx}`}
                  data-bs-parent='#categoryAccordion'
                >
                  <div className='accordion-body'>
                    {desc.categories.map((cate) => (
                      <div key={cate.categoryName}>
                        <div className='row'>
                          <div className='col-12 col-md-4'>
                            <strong>{cate.categoryName}</strong>
                          </div>
                          <div className='col-12 col-md-8'>
                            {cate.subCategories.length > 0 ? (
                              <ul>
                                {cate.subCategories.map((subCate, subIdx) => (
                                  <li key={subIdx}>
                                    {subCate.subCategoryName}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p>No Subcategories Available</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductShop;
