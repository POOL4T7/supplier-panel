import { useEffect, useRef, useState } from 'react';
import axiosInstance from '../../../axios';
import { useAtom } from 'jotai';
import { bussinessProfile, userDetailsAtom } from '../../../storges/user';
import Spinner from '../../../components/common/Spinner';
import CreatableSelect from 'react-select/creatable';
import { toast } from 'react-toastify';
import RightDrawer from '../../../components/Product/RightDrawer';
import FormContainer from '../../../components/common/FormContainer';

const debounceFetch = (func, delay) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const customStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: 'transparent',
    borderColor: '#1f2317',
    color: '#e0e2da',
  }),
  option: (base, { isFocused, isSelected }) => ({
    ...base,
    backgroundColor: isSelected ? '#e0e2da' : isFocused ? '#e0e2da' : 'white',
    color: isSelected ? 'green' : '#355e3b',
  }),
  singleValue: (base) => ({
    ...base,
    color: '#182402',
  }),
};

const ProductShop = () => {
  const selectRef = useRef(null);
  // eslint-disable-next-line no-unused-vars
  const [supplier] = useAtom(userDetailsAtom);
  const [bussiness] = useAtom(bussinessProfile);
  const [descriptionOptionList, setDescriptionOptionList] = useState([]);
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [listData, setListData] = useState([]);
  const [structure, setStructure] = useState(null);
  const [bussinessLoading, setBussinessLoading] = useState(false);
  const [createCategoryLoading, setCreateCategoryLoading] = useState(false);
  const [createSubCategoryLoading, setSubCreateCategoryLoading] =
    useState(false);
  const [movedCategoryLoading, setMovedCategoryLoading] = useState(false);
  const [movedSubCategoryLoading, setMovedSubCategoryLoading] = useState(false);
  const [allDesc, setAllDesc] = useState([]);
  const [description, setDescription] = useState('');
  const [movedSubCategories, setMovedSubCategories] = useState([]);

  const [movedCategories, setMovedCategories] = useState([]);

  const [globalLoading, setGlobalLoading] = useState(true);

  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [uploadLoading, setUploadLoading] = useState(false);

  const handleInputChange = async (inputValue) => {
    try {
      setBussinessLoading(true);
      const res = await axiosInstance.get(
        `/proxy/productsearchsupplier/getAllBusinessDescription?description=${inputValue}&type=products`
      );

      const data = Array.isArray(res.data) ? res.data : [];
      setDescriptionOptionList(
        data.map((desc) => ({
          value: desc.description,
          label: desc.description,
        }))
      );
      setBussinessLoading(false);
    } catch (error) {
      console.error('Error fetching business descriptions:', error);
    }
  };

  const handleCreate = async (value) => {
    if (value) {
      try {
        // setBussinessLoading(true);
        await axiosInstance.post(
          '/proxy/productsearchsupplier/api/supplier/file/addSupplierBusinessDescription',
          {
            supplierBusinessId: bussiness.id,
            supplierBusinessDescription: value,
            type: 'products',
          }
        );
        const res2 = await axiosInstance.get(
          `/proxy/productsearchsupplier/getAllDetailsByBusinessDescription?supplierBusinessId=${bussiness.id}&productOrService=products`
        );
        setStructure(res2.data);
        setDescriptionOptionList([
          ...descriptionOptionList,
          { label: value, value },
        ]);
        // setDescriptionOptionList(value);
        // setBussinessLoading(false);
        if (selectRef.current && value) {
          selectRef.current.setValue({
            value: value,
            label: value,
          });
        }
        console.log('Business description added successfully');
      } catch (error) {
        console.error('Error adding business description:', error);
      }
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!description) {
      toast.error('Bussiness description is required for adding category');
      return;
    }
    if (
      movedCategories.findIndex(
        (item) => item.name.toLowerCase() === category.toLowerCase()
      ) != -1 ||
      listData.findIndex(
        (item) => item.name.toLowerCase() === category.toLowerCase()
      ) != -1
    ) {
      toast.error('Category already exists');
      return;
    }
    setCreateCategoryLoading(true);
    const res = await axiosInstance.post(
      '/proxy/productsearchsupplier/saveCategoryDetails',
      {
        categoryName: category,
        productsServices: 'products',
        supplierBusinessId: bussiness.id,
        categoryDescription: description,
        supplierBusinessDescription: description,
      }
    );
    const p = {
      name: res.data.categoryName,
      id: res.data.id,
    };

    const res2 = await axiosInstance.get(
      `/proxy/productsearchsupplier/getAllDetailsByBusinessDescription?supplierBusinessId=${bussiness.id}&productOrService=products`
    );
    setStructure(res2.data);

    setListData([...listData, p]);

    setCreateCategoryLoading(false);
    setSelectedCategory(null);
    setCategory('');
  };

  const handleCreateSubCatgeory = async (e) => {
    e.preventDefault();
    if (
      movedSubCategories.findIndex(
        (item) => item.name.toLowerCase() === subCategory.toLowerCase()
      ) != -1 ||
      listData.findIndex(
        (item) => item.name.toLowerCase() === subCategory.toLowerCase()
      ) != -1
    ) {
      toast.error('Category already exists');
      return;
    }
    setSubCreateCategoryLoading(true);
    const res = await axiosInstance.post(
      '/proxy/productsearchsupplier/saveSubCategoryDetails',
      {
        subCategoryName: subCategory,
        productsServices: 'products',
        categoryId: category.id,
        supplierBusinessId: bussiness.id,
        supplierBusinessDescription: description,
      }
    );
    const res2 = await axiosInstance.get(
      `/proxy/productsearchsupplier/getAllDetailsByBusinessDescription?supplierBusinessId=${bussiness.id}&productOrService=products`
    );
    setStructure(res2.data);

    const newCategory = {
      name: res.data.subCategoryName,
      id: res.data.id,
      categoryId: category.id,
    };
    setListData([...listData, newCategory]);
    // setSubCategoriesValue('');
    setSubCreateCategoryLoading(false);
    setSubCategory('');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setGlobalLoading(true);
        const res = await axiosInstance.get(
          `/proxy/productsearchsupplier/getBusinessDescriptionByType?type=products&supplierBusinessId=${bussiness.id}`
        );
        const res2 = await axiosInstance.get(
          `/proxy/productsearchsupplier/getAllDetailsByBusinessDescription?supplierBusinessId=${bussiness.id}&productOrService=products`
        );
        setAllDesc(res.data);
        setStructure(res2.data);
        setGlobalLoading(false);
      } catch (e) {
        console.log(e);
      }
    };
    if (bussiness?.id) fetchData();
  }, [bussiness.id]);

  const handleDescriptionChange = debounceFetch(handleInputChange, 500);

  if (globalLoading)
    return (
      <div className='d-flex'>
        {' '}
        <Spinner />{' '}
      </div>
    );

  return (
    <FormContainer>
      <div className='row' style={{ maxWidth: '600px', width: '100%' }}>
        <div>
          <div>
            <h2>Create Shop</h2>
          </div>
          <div className='row align-items-end'>
            <div className='col-12'>
              <div className='mb-2'>
                <CreatableSelect
                  ref={(el) => {
                    if (el) selectRef.current = el;
                  }}
                  styles={customStyles}
                  isClearable
                  options={descriptionOptionList}
                  classNamePrefix='react-select'
                  isLoading={bussinessLoading}
                  value={{ label: description, value: description }}
                  onChange={async (value) => {
                    setDescription(value?.value);
                    // console.log('here', value, allMovedcategory);
                    if (value) {
                      // setCategoryLoading(true);
                      setMovedCategoryLoading(true);
                      const res2 = await axiosInstance.get(
                        `/proxy/productsearchsupplier/getCategoryDetails?type=products&businessDescription=${value.value}&supplierBusinessId=${bussiness.id}`
                      );
                      const res = await axiosInstance.get(
                        `/proxy/productsearchsupplier/getSupplierCategoryDetails?type=products&supplierBusinessId=${bussiness.id}&businessDescription=${value.value}`
                      );
                      console.log('res2', res2.data);
                      console.log('res2', res.data);
                      setListData(
                        res2.data.map((item) => {
                          return {
                            id: item.id,
                            name: item.categoryName,
                            categoryDescription: item.categoryDescription,
                            supplierBusinessDescription: value.value,
                            type: 'category',
                          };
                        })
                      );
                      setMovedCategories(
                        res.data.map((item) => {
                          return {
                            id: item.categoryId,
                            name: item.supplierCategoryName,
                            categoryDescription:
                              item.supplierCategoryDescription,
                            supplierBusinessDescription:
                              item.supplierBusinessDescription,
                            type: 'category',
                            categoryId: item.categoryId,
                          };
                        })
                      );
                      // setCategoryLoading(false);
                      setMovedCategoryLoading(false);
                    } else {
                      setListData([]);
                      setMovedCategories([]);
                      setSelectedCategory(null);
                    }
                    setMovedSubCategories([]);
                    setCategory('');
                    setSubCategory('');
                  }}
                  onInputChange={(inputValue) => {
                    if (inputValue.length > 2)
                      handleDescriptionChange(inputValue);
                    return inputValue;
                  }}
                  onCreateOption={handleCreate}
                  placeholder='bussiness description'
                />
              </div>
              {allDesc.length > 0 && (
                <div
                  className='mb-4 d-flex flex-wrap gap-2'
                  style={{ maxHeight: '50px', overflowY: 'auto' }}
                >
                  {allDesc.map((item, index) => (
                    <span
                      key={index}
                      className='badge rounded-pill bg-primary px-2 py-1 text-white'
                      style={{ cursor: 'pointer', height: '20px' }}
                      onClick={() => {
                        if (selectRef.current) {
                          selectRef.current.setValue({
                            value: item,
                            label: item,
                          });
                        }
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className='row align-items-end g-2'>
            <div className='col-8 col-md-10'>
              <div className='mb-2'>
                <label className='form-label'>Category</label>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Enter category'
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setListData([]);
                    setSelectedCategory(null);
                    if (e.target.value == '') {
                      if (selectRef.current) {
                        selectRef.current.setValue({
                          value: selectRef?.current?.getValue?.()?.[0]?.value,
                          label: selectRef?.current?.getValue?.()?.[0]?.value,
                        });
                      }
                    }
                  }}
                  disabled={!selectRef?.current?.getValue?.()?.[0]?.value}
                  value={category}
                />
                <div className='invalid-feedback'>
                  Please provide a valid description.
                </div>
              </div>
            </div>
            <div
              className='col-4 col-md-2 d-flex justify-content-end'
              style={{ marginBottom: '8px' }}
            >
              <button
                className='btn btn-primary w-100'
                onClick={handleCreateCategory}
              >
                {createCategoryLoading && (
                  <Spinner width='20px' height='20px' />
                )}{' '}
                <span> Add</span>
              </button>
            </div>
            {movedCategoryLoading ? (
              <Spinner width='15px' height='15px' />
            ) : (
              <div
                className='mb-4 d-flex flex-wrap gap-2'
                style={{ maxHeight: '50px', overflowY: 'auto' }}
              >
                {movedCategories.map((item, index) => (
                  <span
                    key={index}
                    className='badge rounded-pill bg-primary px-2 py-1 text-white'
                    style={{ cursor: 'pointer', height: '20px' }}
                    onClick={async () => {
                      try {
                        setSelectedCategory(item);
                        setCategory(item.name);
                        setMovedSubCategoryLoading(true);
                        const res = await axiosInstance.get(
                          `/proxy/productsearchsupplier/getSubCategoryDetails?categoryId=${item.categoryId}&type=products&supplierBusinessId=${bussiness.id}`
                        );
                        const res2 = await axiosInstance.get(
                          `/proxy/productsearchsupplier/getSupplierSubCategoryDetails?supplierCategoryId=${item.categoryId}&type=products&supplierBusinessId=${bussiness.id}`
                        );

                        setListData(
                          res.data.map((item) => ({
                            id: item.id,
                            name: item.subCategoryName,
                            supplierBusinessDescription:
                              item.supplierBusinessDescription,
                            subCategoryDescription:
                              item.supplierCategoryDescription,
                            type: 'subCategory',
                            categoryId: item.categoryId,
                          }))
                        );
                        setMovedSubCategories(
                          res2.data.map((item) => ({
                            id: item.id,
                            name: item.supplierSubCategoryName,
                            supplierBusinessDescription:
                              item.supplierBusinessDescription,
                            subCategoryDescription:
                              item.supplierCategoryDescription,
                            type: 'subCategory',
                          }))
                        );
                        setMovedSubCategoryLoading(false);
                      } catch (e) {
                        console.log(e);
                      }
                    }}
                  >
                    {item.name}
                  </span>
                ))}
              </div>
            )}
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
            <div
              className='col-4 col-md-2 d-flex justify-content-end'
              style={{ marginBottom: '8px' }}
            >
              <button
                className='btn btn-primary w-100'
                onClick={handleCreateSubCatgeory}
              >
                {createSubCategoryLoading && (
                  <Spinner width='20px' height='20px' />
                )}{' '}
                <span> Add</span>
              </button>
            </div>
            {movedSubCategoryLoading ? (
              <Spinner width='20px' height='20px' />
            ) : (
              <div className='mb-4 d-flex flex-wrap gap-2'>
                {movedSubCategories.map((item, index) => (
                  <span
                    key={index}
                    className='badge rounded-pill bg-primary px-2 py-1 text-white'
                    style={{ cursor: 'pointer' }}
                  >
                    {item.name}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div
            className='border p-3 mt-2'
            style={{
              height: '280px',
              overflowY: 'scroll',
              position: 'relative',
            }}
          >
            <h5>
              {selectedCategory ? (
                <>Sub Category List</>
              ) : description ? (
                <>Category List</>
              ) : (
                <></>
              )}
            </h5>
            {movedSubCategoryLoading || movedCategoryLoading ? (
              <div className='d-flex'>
                <Spinner height='100px' width='100px' />
              </div>
            ) : (
              listData?.map((product) => (
                <div key={product.id} className='form-check mb-2'>
                  <input
                    type='checkbox'
                    className='form-check-input'
                    checked={selectedIds.includes(product.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds([...selectedIds, product.id]);
                      } else {
                        setSelectedIds(
                          selectedIds.filter((id) => id !== product.id)
                        );
                      }
                    }}
                  />
                  <label className='form-check-label'>{product.name}</label>
                </div>
              ))
            )}
          </div>
          <div>
            <button
              className='btn btn-outline-danger m-2'
              onClick={() => {
                setSelectedIds([]);
              }}
            >
              Cancel
            </button>
            <button
              className='btn btn-primary'
              disabled={uploadLoading || selectedIds.length === 0}
              onClick={async () => {
                setUploadLoading(true);
                if (selectedCategory) {
                  console.log('moved to active sub category');
                  await axiosInstance.post(
                    '/proxy/productsearchsupplier/supplierSubCategoryDetailsStatus',
                    {
                      supplierBusinessId: bussiness.id,
                      subCategoryIds: selectedIds,
                      status: true,
                      categoryId: selectedCategory.categoryId,
                      supplierBusinessDescription: description,
                    }
                  );
                  const res2 = await axiosInstance.get(
                    `/proxy/productsearchsupplier/getSupplierSubCategoryDetails?supplierCategoryId=${selectedCategory.categoryId}&type=products&supplierBusinessId=${bussiness.id}`
                  );
                  setMovedSubCategories(
                    res2.data.map((item) => ({
                      id: item.id,
                      name: item.supplierSubCategoryName,
                      supplierBusinessDescription:
                        item.supplierBusinessDescription,
                      subCategoryDescription: item.supplierCategoryDescription,
                      type: 'subCategory',
                    }))
                  );
                } else {
                  console.log('moved to active category');
                  await axiosInstance.post(
                    '/proxy/productsearchsupplier/supplierCategoryDetailsStatus',
                    {
                      supplierBusinessId: bussiness.id,
                      categoryIds: selectedIds,
                      status: true,
                      supplierBusinessDescription: description,
                    }
                  );
                  const res = await axiosInstance.get(
                    `/proxy/productsearchsupplier/getSupplierCategoryDetails?type=products&supplierBusinessId=${bussiness.id}&businessDescription=${description}`
                  );
                  setMovedCategories(
                    res.data.map((item) => {
                      return {
                        id: item.categoryId,
                        name: item.supplierCategoryName,
                        categoryDescription: item.supplierCategoryDescription,
                        supplierBusinessDescription:
                          item.supplierBusinessDescription,
                        type: 'category',
                        categoryId: item.categoryId,
                      };
                    })
                  );
                }
                const res2 = await axiosInstance.get(
                  `/proxy/productsearchsupplier/getAllDetailsByBusinessDescription?supplierBusinessId=${bussiness.id}&productOrService=products`
                );

                setStructure(res2.data);
                setUploadLoading(false);
                setListData(
                  listData.filter((item) => !selectedIds.includes(item.id))
                );
              }}
            >
              Update
            </button>
          </div>
        </div>
        {/* <div className='col-12 col-md-6 mt-4 mt-md-0'>
          <div className='row'>
            <div className='col-12'>
              <h2>Your Shop</h2>
            </div>
          </div>

          {globalLoading ? (
            <div className='d-flex'>
              <Spinner />
            </div>
          ) : (
            <div className='accordion' id='categoryAccordion'>
              {structure?.map((desc, idx) => (
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
                      <div className='row '>
                        <div className='col-4'>
                          <h5>Category</h5>
                        </div>
                        <div className='col-8'>
                          <h5>Sub Category</h5>
                        </div>
                      </div>
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
          )}
        </div> */}
      </div>
      <RightDrawer structure={structure} />
    </FormContainer>
  );
};

export default ProductShop;
