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
        const res = await axios.post(
          `/proxy/productsearchsupplier/search`,
          data
        );
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
                      <div className=''>
                        <div>
                          <Phone size={15} />{' '}
                          <span className='small'>
                            {item.mobileNumber || 'NA'}
                          </span>
                        </div>
                        <div>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            x='0px'
                            y='0px'
                            width='15'
                            height='15'
                            viewBox='0 0 24 24'
                          >
                            <path d='M 12.011719 2 C 6.5057187 2 2.0234844 6.478375 2.0214844 11.984375 C 2.0204844 13.744375 2.4814687 15.462563 3.3554688 16.976562 L 2 22 L 7.2324219 20.763672 C 8.6914219 21.559672 10.333859 21.977516 12.005859 21.978516 L 12.009766 21.978516 C 17.514766 21.978516 21.995047 17.499141 21.998047 11.994141 C 22.000047 9.3251406 20.962172 6.8157344 19.076172 4.9277344 C 17.190172 3.0407344 14.683719 2.001 12.011719 2 z M 12.009766 4 C 14.145766 4.001 16.153109 4.8337969 17.662109 6.3417969 C 19.171109 7.8517969 20.000047 9.8581875 19.998047 11.992188 C 19.996047 16.396187 16.413812 19.978516 12.007812 19.978516 C 10.674812 19.977516 9.3544062 19.642812 8.1914062 19.007812 L 7.5175781 18.640625 L 6.7734375 18.816406 L 4.8046875 19.28125 L 5.2851562 17.496094 L 5.5019531 16.695312 L 5.0878906 15.976562 C 4.3898906 14.768562 4.0204844 13.387375 4.0214844 11.984375 C 4.0234844 7.582375 7.6067656 4 12.009766 4 z M 8.4765625 7.375 C 8.3095625 7.375 8.0395469 7.4375 7.8105469 7.6875 C 7.5815469 7.9365 6.9355469 8.5395781 6.9355469 9.7675781 C 6.9355469 10.995578 7.8300781 12.182609 7.9550781 12.349609 C 8.0790781 12.515609 9.68175 15.115234 12.21875 16.115234 C 14.32675 16.946234 14.754891 16.782234 15.212891 16.740234 C 15.670891 16.699234 16.690438 16.137687 16.898438 15.554688 C 17.106437 14.971687 17.106922 14.470187 17.044922 14.367188 C 16.982922 14.263188 16.816406 14.201172 16.566406 14.076172 C 16.317406 13.951172 15.090328 13.348625 14.861328 13.265625 C 14.632328 13.182625 14.464828 13.140625 14.298828 13.390625 C 14.132828 13.640625 13.655766 14.201187 13.509766 14.367188 C 13.363766 14.534188 13.21875 14.556641 12.96875 14.431641 C 12.71875 14.305641 11.914938 14.041406 10.960938 13.191406 C 10.218937 12.530406 9.7182656 11.714844 9.5722656 11.464844 C 9.4272656 11.215844 9.5585938 11.079078 9.6835938 10.955078 C 9.7955938 10.843078 9.9316406 10.663578 10.056641 10.517578 C 10.180641 10.371578 10.223641 10.267562 10.306641 10.101562 C 10.389641 9.9355625 10.347156 9.7890625 10.285156 9.6640625 C 10.223156 9.5390625 9.737625 8.3065 9.515625 7.8125 C 9.328625 7.3975 9.131125 7.3878594 8.953125 7.3808594 C 8.808125 7.3748594 8.6425625 7.375 8.4765625 7.375 z'></path>
                          </svg>
                          {'   '} {item.whatsappNumber || 'NA'}
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
                      // copy the mobileNumber and call
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
