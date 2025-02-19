import axios from 'axios';
import { Mail, MapPinHouse, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Spinner from '../components/common/Spinner';

const SearchResult = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = JSON.parse(query);
        const res = await axios.post(`/proxy/productsearch/search`, data);
        setProductList(res.data);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    };
    if (query) fetchData();
  }, [query]);

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

  if (loading) {
    return (
      <div style={{ marginTop: '6rem' }} className='d-flex'>
        <Spinner />
      </div>
    );
  }

  return (
    <div className='container' style={{ marginTop: '6rem' }}>
      <div className='row'>
        {/* Left Column - Search Results */}
        <div className='col-12 col-md-8'>
          {productList?.length === 0 && (
            <div className='d-flex justify-content-center'>
              <h4>No Product found?</h4>
            </div>
          )}
          {productList.map((item, idx) => (
            <div
              className='card p-3 shadow-sm border-0 col-12 mb-3'
              key={idx}
              style={{ backgroundColor: '#d3d7c8' }}
            >
              <div className='row'>
                <div className='col-12 col-md-4'>
                  <div className='row'>
                    <div className='col-6 col-md-12'>
                      <img
                        src={
                          item.supplierBusinessDetails.businessImage
                            ? buildImage(
                                item.supplierBusinessDetails.businessImage
                              )
                            : '/images/logo.webp'
                        }
                        alt='Company Logo'
                        className='me-3'
                        style={{ width: '100px', height: '100px' }}
                      />
                    </div>
                    <div className='col-6 col-md-12'>
                      {/* <p className='small mb-1'>
                        <Truck size={15} /> {'  '}
                        <span className='fw-bold'>
                          {item.supplierBusinessDetails.country || 'Germany'}
                        </span>
                      </p> */}

                      <p className='small mb-1'>
                        <Mail size={15} /> {'  '}
                        {item.supplierBusinessDetails.email || 'NA'}
                      </p>
                      <div className='ms-auto'>
                        <MapPinHouse size={15} />{' '}
                        <span className='small'>
                          {item.supplierBusinessDetails.city}{' '}
                          {item.supplierBusinessDetails.country}
                        </span>
                      </div>
                      <div className='d-flex gap-3 mt-3'>
                        {item.supplierBusinessDetails.mobileNumber && (
                          <div>
                            <a
                              href={`tel:${item.supplierBusinessDetails.mobileNumber}`}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                textDecoration: 'none',
                                color: 'inherit',
                              }}
                            >
                              <Phone size={20} />
                            </a>
                          </div>
                        )}

                        <div className=''>
                          {item.supplierBusinessDetails.whatsappNumber && (
                            <a
                              href={`https://wa.me/${item.supplierBusinessDetails.whatsappNumber}`}
                              target='_blank'
                              rel='noopener noreferrer'
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                textDecoration: 'none',
                                color: 'inherit',
                              }}
                            >
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='20'
                                height='20'
                                viewBox='0 0 24 24'
                              >
                                <path d='M12.011719 2C6.5057187 2 2.0234844 6.478375 2.0214844 11.984375C2.0204844 13.744375 2.4814687 15.462563 3.3554688 16.976562L2 22L7.2324219 20.763672C8.6914219 21.559672 10.333859 21.977516 12.005859 21.978516C17.514766 21.978516 21.995047 17.499141 21.998047 11.994141C22.000047 9.3251406 20.962172 6.8157344 19.076172 4.9277344C17.190172 3.0407344 14.683719 2.001 12.011719 2ZM12.009766 4C14.145766 4.001 16.153109 4.8337969 17.662109 6.3417969C19.171109 7.8517969 20.000047 9.8581875 19.998047 11.992188C19.996047 16.396187 16.413812 19.978516 12.007812 19.978516C10.674812 19.977516 9.3544062 19.642812 8.1914062 19.007812L7.5175781 18.640625 6.7734375 18.816406 4.8046875 19.28125 5.2851562 17.496094 5.5019531 16.695312 5.0878906 15.976562C4.3898906 14.768562 4.0204844 13.387375 4.0214844 11.984375 4.0234844 7.582375 7.6067656 4 12.009766 4Z' />
                              </svg>
                              <span
                                className='small'
                                style={{ marginLeft: '5px' }}
                              >
                                {item.whatsappNumber}
                              </span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-12 col-md-8'>
                  <h3 className='fw-bold text-primary d-flex'>
                    {item.supplierBusinessDetails.businessName}
                  </h3>
                  <p className='mt-3 small'>
                    {/* {item.supplierBusinessDetails.aboutUs ||
                      "About is not available"} */}
                    {item.supplierBusinessDetails?.businessDescription?.join(
                      ', '
                    )}
                  </p>
                  <div className=''>
                    {Object.keys(item.matchedSearchTermNames).map(
                      (key) =>
                        item?.matchedSearchTermNames[key]?.length > 0 && (
                          <div key={key} className='mb-1 d-flex flex-wrap'>
                            <h5>{key.replace(/([A-Z])/g, ' $1')}: </h5>
                            {item.matchedSearchTermNames[key]
                              .slice(0, 4)
                              .map((item, index) => (
                                <span
                                  key={index}
                                  className='badge rounded-pill bg-primary px-2 py-1 text-white m-1'
                                  style={{ cursor: 'pointer' }}
                                >
                                  {item}
                                </span>
                              ))}
                          </div>
                        )
                    )}
                  </div>
                </div>
                <div className='d-flex justify-content-end align-items-end h-100 gap-2'>
                  <button
                    className='btn btn-success fw-bold'
                    onClick={() => {
                      const phoneNumber = item?.mobileNumber; // Replace with your dynamic phone number
                      if (phoneNumber) {
                        window.location.href = `tel:${phoneNumber}`;
                      } else {
                        alert('No phone number available');
                      }
                    }}
                  >
                    Contact
                  </button>

                  <a
                    href={`/supplier-details?id=${item.supplierBusinessDetails.businessId}`}
                    className='text-success fw-bold'
                  >
                    View Profile
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column - Filters (Fixed) */}
        <div className='col-12 col-md-4'>
          <div
            className='d-none d-md-block position-sticky top-0 p-3 shadow-sm border rounded'
            style={{ backgroundColor: '#d2d8c8' }}
          >
            <h5 className='fw-bold'>Filters</h5>
            {/* Add filter options here */}
            <p>Coming soon..</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
