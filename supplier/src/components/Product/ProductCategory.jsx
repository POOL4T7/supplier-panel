import { useCallback, useEffect, useRef, useState } from 'react';
import axiosInstance from '../../axios';
import { useAtom } from 'jotai';
import { bussinessProfile, userDetailsAtom } from '../../storges/user';
import CreatableSelect from 'react-select/creatable';
import Spinner from '../common/Spinner';
import { toast } from 'react-toastify';
import useIsMobile from '../../hooks/useIsMobile';
import { ArrowDown, ArrowUp, MoveLeft, MoveRight } from 'lucide-react';

const customStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: 'transparent', // Background color
    borderColor: '#1f2317', // Border color
    color: '#e0e2da', // Text color
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

const ProductCategory = () => {
  const selectRef = useRef(null);
  const isMobile = useIsMobile();
  const [uploadedCategories, setUploadedCategories] = useState([]);
  const [filteredUploadedCategories, setFilteredUploadedCategories] = useState(
    []
  );
  const [movedCategories, setMovedCategories] = useState([]);
  const [filteredMovedCategories, setFilteredMovedCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isLeftSelected, setIsLeftSelected] = useState(false);
  const [isRightSelected, setIsRightSelected] = useState(false);
  const [categoriesValue, setCategoriesValue] = useState('');
  const [description, setDescription] = useState([]);
  const [uploadedSearch, setUploadedSearch] = useState('');
  const [movedSearch, setMovedSearch] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [supplier] = useAtom(userDetailsAtom);
  const [bussiness] = useAtom(bussinessProfile);
  const [allDesc, setAllDesc] = useState([]);
  const [d, setD] = useState('');
  // const [allMovedcategory, setAllMovedCatgeory] = useState([]);
  const [bussinessLoading, setBussinessLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [createCategoryLoading, setCreateCategoryLoading] = useState(false);
  const [movedCategoryLoading, setMovedCategoryLoading] = useState(false);
  const [structure, setStructure] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFilteredUploadedCategories(uploadedCategories);
  }, [uploadedCategories]);

  useEffect(() => {
    setFilteredMovedCategories(movedCategories);
  }, [movedCategories]);

  const toggleSelectProduct = (product, type) => {
    if (type === 'left') {
      setIsLeftSelected(false);
      setIsRightSelected(true);
    } else {
      setIsLeftSelected(true);
      setIsRightSelected(false);
    }
    setSelectedCategories((prevSelected) => {
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

  const moveToRight = async () => {
    await axiosInstance.post(
      '/proxy/productsearchsupplier/supplierCategoryDetailsStatus',
      {
        supplierBusinessId: bussiness.id,
        categoryIds: [...selectedCategories].map((item) => item.id),
        status: true,
        supplierBusinessDescription: d,
      }
    );
    const res2 = await axiosInstance.get(
      `/proxy/productsearchsupplier/getSupplierCategoriesForStructured?type=products&supplierBusinessId=${bussiness.id}`
    );
    setStructure(res2.data);
    setMovedCategories((prev) => [...prev, ...selectedCategories]);
    setUploadedCategories((prev) =>
      prev.filter((p) => !selectedCategories.includes(p))
    );
    setSelectedCategories([]);
    setIsRightSelected(false);
    if (!allDesc.includes(d)) {
      setAllDesc([...allDesc, d]);
    }
  };

  const moveToLeft = async () => {
    await axiosInstance.post(
      '/proxy/productsearchsupplier/supplierCategoryDetailsStatus',
      {
        supplierBusinessId: bussiness.id,
        categoryIds: [...selectedCategories].map((item) => item.id),
        status: false,
      }
    );
    const res2 = await axiosInstance.get(
      `/proxy/productsearchsupplier/getSupplierCategoriesForStructured?type=products&supplierBusinessId=${bussiness.id}`
    );
    setStructure(res2.data);
    setUploadedCategories((prev) => [...prev, ...selectedCategories]);
    setMovedCategories((prev) =>
      prev.filter((p) => !selectedCategories.includes(p))
    );
    setSelectedCategories([]);
    setIsLeftSelected(false);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!d) {
      toast.error('Bussiness description is required for adding category');

      return;
    }
    setCreateCategoryLoading(true);

    const res = await axiosInstance.post(
      '/proxy/productsearchsupplier/saveCategoryDetails',
      {
        categoryName: categoriesValue,
        productsServices: 'products',
        supplierBusinessId: bussiness.id,
        categoryDescription: d,
        supplierBusinessDescription: d,
      }
    );
    const p = {
      categoryName: res.data.categoryName,
      id: res.data.id,
    };

    const res2 = await axiosInstance.get(
      `/proxy/productsearchsupplier/getSupplierCategoriesForStructured?type=products&supplierBusinessId=${bussiness.id}`
    );
    setStructure(res2.data);

    // setUploadedCategories([p, ...uploadedCategories]);
    setUploadedCategories([...uploadedCategories, p]);
    setCategoriesValue('');
    setCreateCategoryLoading(false);
  };

  const handleSearch = (query, type) => {
    if (type === 'uploaded') {
      setUploadedSearch(query);
      setFilteredUploadedCategories(
        uploadedCategories.filter((category) =>
          category.categoryName?.toLowerCase().includes(query.toLowerCase())
        )
      );
    } else {
      // console.log(query, type, movedCategories);
      setMovedSearch(query);
      setFilteredMovedCategories(
        movedCategories.filter((category) =>
          category.categoryName?.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  };

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        `/proxy/productsearchsupplier/getBusinessDescriptionByType?type=products&supplierBusinessId=${bussiness.id}`
      );
      const desc = res.data;
      setAllDesc(desc);
      console.log(desc, selectRef.current);
      if (selectRef.current && desc?.length) {
        selectRef.current.setValue({
          value: desc[0],
          label: desc[0],
        });
      }
      const res2 = await axiosInstance.get(
        `/proxy/productsearchsupplier/getSupplierCategoriesForStructured?type=products&supplierBusinessId=${bussiness.id}`
      );
      setStructure(res2.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, [bussiness.id]);

  useEffect(() => {
    if (bussiness.id) fetchCategories();
  }, [bussiness.id, fetchCategories]);

  const handleInputChange = async (inputValue) => {
    if (!inputValue.trim()) {
      setDescription([]);
      return;
    }
    setBussinessLoading(true);
    try {
      const res = await axiosInstance.get(
        `/proxy/productsearchsupplier/getAllBusinessDescription?description=${inputValue}&type=products`
      );
      const data = Array.isArray(res.data) ? res.data : [];
      setDescription(
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

  // Update `onInputChange` to handle only the string and debounce the API calls
  const debounceFetch = (func, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedInputChange = debounceFetch(handleInputChange, 500);

  const handleCreate = async (value) => {
    if (value) {
      try {
        setBussinessLoading(true);
        await axiosInstance.post(
          '/proxy/productsearchsupplier/api/supplier/file/addSupplierBusinessDescription',
          {
            supplierBusinessId: bussiness.id,
            supplierBusinessDescription: value,
            type: 'products',
          }
        );
        const res2 = await axiosInstance.get(
          `/proxy/productsearchsupplier/getSupplierCategoriesForStructured?type=products&supplierBusinessId=${bussiness.id}`
        );
        setStructure(res2.data);
        setDescription([...description, { label: value, value }]);
        setD(value);
        setBussinessLoading(false);
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

  if (loading) {
    return (
      <div className='d-flex'>
        <Spinner />
      </div>
    );
  }
  // console.log('selectRef', selectRef.current);
  return (
    <>
      <div className='row'>
        <div className='col-12 col-md-7'>
          <>
            <div className='mb-2'>
              <CreatableSelect
                ref={(el) => {
                  if (el) selectRef.current = el;
                }}
                styles={customStyles}
                isClearable
                options={description}
                classNamePrefix='react-select'
                isLoading={bussinessLoading}
                value={{ label: d, value: d }}
                onChange={async (value) => {
                  setD(value?.value);
                  // console.log('here', value, allMovedcategory);
                  if (value) {
                    setCategoryLoading(true);
                    setMovedCategoryLoading(true);
                    const res2 = await axiosInstance.get(
                      `/proxy/productsearchsupplier/getCategoryDetails?type=products&businessDescription=${value.value}&supplierBusinessId=${bussiness.id}`
                    );
                    const res = await axiosInstance.get(
                      `/proxy/productsearchsupplier/getSupplierCategoryDetails?type=products&supplierBusinessId=${bussiness.id}&businessDescription=${value.value}`
                    );

                    // const categories = res.data.map((item) => {
                    //   return {
                    //     id: item.id,
                    //     categoryName: item.supplierCategoryName,
                    //     categoryDescription: item.supplierCategoryDescription,
                    //     supplierBusinessDescription:
                    //       item.supplierBusinessDescription,
                    //   };
                    // });

                    setUploadedCategories(
                      res2.data.map((item) => {
                        return {
                          id: item.id,
                          categoryName: item.categoryName,
                          categoryDescription: item.categoryDescription,
                          supplierBusinessDescription: value.value,
                        };
                      })
                    );
                    setMovedCategories(
                      res.data.map((item) => {
                        return {
                          id: item.id,
                          categoryName: item.supplierCategoryName,
                          categoryDescription: item.supplierCategoryDescription,
                          supplierBusinessDescription:
                            item.supplierBusinessDescription,
                        };
                      })
                    );
                    setCategoryLoading(false);
                    setMovedCategoryLoading(false);
                  } else {
                    setUploadedCategories([]);
                    setMovedCategories([]);
                  }
                }}
                onInputChange={(inputValue) => {
                  if (inputValue.length > 2) debouncedInputChange(inputValue);
                  return inputValue;
                }}
                onCreateOption={handleCreate}
                placeholder='bussiness description'
                // onMenuClose={()=>{
                //   alert("hey")
                // }}
              />
            </div>
            {allDesc.length > 0 && (
              <div className='mb-4 d-flex flex-wrap gap-2'>
                {allDesc.map((item, index) => (
                  <span
                    key={index}
                    className='badge rounded-pill bg-primary px-3 py-2 text-white'
                    style={{ cursor: 'pointer' }}
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
            <div className='row mb-2'>
              <div className='col-10'>
                <input
                  type='text'
                  value={categoriesValue}
                  className='form-control'
                  placeholder='Enter category name'
                  onChange={(e) => setCategoriesValue(e.target.value)}
                />
              </div>
              <div className='col-2'>
                <button
                  className='btn btn-primary'
                  onClick={handleAddProduct}
                  disabled={!categoriesValue || createCategoryLoading}
                >
                  {createCategoryLoading && (
                    <Spinner width='15px' height='15px' />
                  )}{' '}
                  Add
                </button>
              </div>
            </div>
          </>
          {categoryLoading ? (
            <div className='d-flex '>
              <Spinner />
            </div>
          ) : (
            <div className='row'>
              <div className='col-md-5'>
                <input
                  type='text'
                  value={uploadedSearch}
                  className='form-control mb-3'
                  placeholder='Search uploaded categories'
                  onChange={(e) => handleSearch(e.target.value, 'uploaded')}
                />
                <div
                  className='border p-3'
                  id='uploaded-category'
                  style={{ height: '60vh', overflowY: 'scroll' }}
                >
                  <h5>Uploaded Categories</h5>
                  <div className='d-flex'>
                    {categoryLoading && <Spinner width='50px' height='50px' />}
                  </div>
                  {filteredUploadedCategories.map((product) => (
                    <div key={product.id} className='form-check mb-2'>
                      <input
                        type='checkbox'
                        className='form-check-input'
                        checked={selectedCategories.includes(product)}
                        onChange={() => toggleSelectProduct(product, 'left')}
                      />
                      <label className='form-check-label'>
                        {product.categoryName}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className='col-md-2 d-flex flex-column justify-content-center align-items-center mt-2'>
                <div className='row'>
                  <div className='col-6 col-md-12'>
                    <button
                      className='btn btn-primary mb-2'
                      onClick={moveToRight}
                      disabled={!isRightSelected}
                    >
                      {isMobile ? <ArrowDown size={24}   /> : <MoveRight size={24} />}
                    </button>
                  </div>
                  <div className='col-6 col-md-12'>
                    <button
                      className='btn btn-primary'
                      onClick={moveToLeft}
                      disabled={!isLeftSelected}
                    >
                      {isMobile ? <ArrowUp size={24}  /> : <MoveLeft size={24}  />}
                    </button>
                  </div>
                </div>
                {/* <button
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
                </button> */}
              </div>

              <div className='col-md-5'>
                <input
                  type='text'
                  value={movedSearch}
                  className='form-control mb-3'
                  placeholder='Search moved categories'
                  onChange={(e) => handleSearch(e.target.value, 'moved')}
                />
                <div
                  className='border p-3'
                  style={{ height: '60vh', overflowY: 'scroll' }}
                >
                  <h5>Moved Categories</h5>
                  <div className='d-flex'>
                    {movedCategoryLoading && (
                      <Spinner width='50px' height='50px' />
                    )}
                  </div>
                  {filteredMovedCategories.map((product) => (
                    <div key={product.id} className='form-check mb-2'>
                      <input
                        type='checkbox'
                        className='form-check-input'
                        checked={selectedCategories.includes(product)}
                        onChange={() => toggleSelectProduct(product, 'right')}
                      />
                      <label className='form-check-label'>
                        {product.categoryName}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className='col-12 col-md-5 mt-1'>
          <div className=' mb-5'>
            <h4>Your Categories by bussiness description</h4>
            <div className='accordion' id='categoryAccordion'>
              {structure.map((item, idx) => (
                <div
                  className='accordion-item'
                  key={item.supplierBusinessDescription}
                >
                  <h2 className='accordion-header' id='headingOne'>
                    <button
                      className='accordion-button'
                      type='button'
                      data-bs-toggle='collapse'
                      data-bs-target={`#collapseOne${idx}`}
                      aria-expanded='true'
                      aria-controls={'collapseOne' + idx}
                    >
                      {item.supplierBusinessDescription}
                    </button>
                  </h2>
                  <div
                    id={'collapseOne' + idx}
                    className='accordion-collapse collapse'
                    aria-labelledby='headingOne'
                    data-bs-parent='#categoryAccordion'
                  >
                    <div className='accordion-body'>
                      <ul className=' d-flex flex-wrap gap-2'>
                        {item?.supplierCategoryName?.map((x) => (
                          <span
                            key={x}
                            className='badge rounded-pill bg-primary px-3 py-2 text-white'
                            // style={{ cursor: 'pointer' }}
                          >
                            {x}
                          </span>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCategory;
