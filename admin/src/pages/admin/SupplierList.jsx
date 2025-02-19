import { useEffect, useState } from 'react';
import axiosInstance from '../../axios';
import Spinner from '../../components/common/Spinner';

const SupplierList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPage = 5;

  // // Calculate indices for slicing data
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // const totalPages = Math.ceil(data.length / itemsPerPage);

  // const handleNextPage = () => {
  //   if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  // };

  // const handlePrevPage = () => {
  //   if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  // };

  // const handlePageClick = (page) => {
  //   setCurrentPage(page);
  // };

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(
          '/proxy/productsearchadmin/api/admin/getAllSupplier'
        );

        setData(res.data);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <>
        <div className='d-flex'>
          <Spinner />
        </div>
      </>
    );
  }

  return (
    <div className='table-responsive mt-3'>
      <h1 className='mt-2'>Supplier List</h1>
      <table className='table table-hover table-bordered shadow-sm table-sm'>
        <thead className='table-light'>
          <tr>
            <th scope='col'>S.no.</th>
            <th scope='col'>Supplier ID</th>
            <th scope='col'>Supplier Name</th>
            <th scope='col'>Business Name</th>
            <th scope='col'>Business Description</th>
            <th scope='col'>Business Address</th>
            <th scope='col'>Premises</th>
            <th scope='col'>Address OTP</th>
            <th scope='col'>isAddress Verified</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={item.id}>
              <th scope='row'>{idx + 1}</th>
              <td>{item.supplierProfile?.id}</td>
              <td>{item.supplierProfile?.supplierName}</td>
              <td>{item.supplierBusinessDetails?.businessName}</td>
              <td>
                {/* {item.supplierBusinessDetails?.businessDescription.join(', ')} */}
              </td>
              <td>{item.supplierBusinessDetails?.addressLine1}</td>
              <td>{item.supplierBusinessDetails?.premisesType}</td>
              <td>{item.supplierBusinessDetails?.verificationAddressOTP}</td>
              <td>{`${item.supplierBusinessDetails?.verifyAddress}`}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* <nav>
        <ul className='pagination'>
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className='page-link' onClick={handlePrevPage}>
              Previous
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, idx) => (
            <li
              key={idx + 1}
              className={`page-item ${currentPage === idx + 1 ? 'active' : ''}`}
            >
              <button
                className='page-link'
                onClick={() => handlePageClick(idx + 1)}
              >
                {idx + 1}
              </button>
            </li>
          ))}
          <li
            className={`page-item ${
              currentPage === totalPages ? 'disabled' : ''
            }`}
          >
            <button className='page-link' onClick={handleNextPage}>
              Next
            </button>
          </li>
        </ul>
      </nav> */}
    </div>
  );
};

export default SupplierList;
