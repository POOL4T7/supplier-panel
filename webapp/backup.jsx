import axios from 'axios';
import { Mail, MapPin, Phone } from 'lucide-react';
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

  if (loading) {
    return (
      <div
        className='d-flex justify-content-center align-items-center'
        style={{ minHeight: '60vh' }}
      >
        <Spinner />
      </div>
    );
  }

  return (
    <div className='container' style={{ marginTop: '6rem' }}>
      <div className='row'>
        {/* Main Content */}
        <div className='col-12 col-lg-8'>
          {productList?.length === 0 ? (
            <div className='text-center py-5'>
              <h4>No products found</h4>
              <p className='text-muted'>Try adjusting your search criteria</p>
            </div>
          ) : (
            productList.map((item, idx) => (
              <div className='card mb-4 shadow-sm' key={idx}>
                <div className='card-body'>
                  <div className='row g-3'>
                    {/* Company Info Column */}
                    <div className='col-12 col-md-4'>
                      <div className='d-flex flex-column h-100'>
                        <div className='text-center mb-3'>
                          <img
                            src={
                              item.supplierBusinessDetails.businessImagePath ||
                              '/images/logo.webp'
                            }
                            alt='Company Logo'
                            className='img-fluid rounded'
                            style={{
                              maxWidth: '150px',
                              maxHeight: '150px',
                              objectFit: 'cover',
                            }}
                          />
                        </div>

                        <div className='mb-3'>
                          <h5 className='fw-bold text-primary'>
                            {item.supplierBusinessDetails.businessName}
                          </h5>
                        </div>

                        <div className='mb-2'>
                          <div className='d-flex align-items-start'>
                            <MapPin
                              className='me-2 mt-1 flex-shrink-0'
                              size={16}
                            />
                            <div>
                              <small className='text-muted'>
                                {[
                                  item.supplierBusinessDetails.address,
                                  item.supplierBusinessDetails.city,
                                  item.supplierBusinessDetails.country,
                                ]
                                  .filter(Boolean)
                                  .join(', ')}
                              </small>
                            </div>
                          </div>
                        </div>

                        <div className='mb-2'>
                          <div className='d-flex align-items-start'>
                            <Mail
                              className='me-2 mt-1 flex-shrink-0'
                              size={16}
                            />
                            <div>
                              <small>
                                {item.supplierBusinessDetails.email ||
                                  'Email not provided'}
                              </small>
                            </div>
                          </div>
                        </div>

                        <div className='mt-auto'>
                          <div className='d-flex gap-3'>
                            {item.supplierBusinessDetails.mobileNumber && (
                              <a
                                href={`tel:${item.supplierBusinessDetails.mobileNumber}`}
                                className='btn btn-sm btn-outline-primary d-flex align-items-center'
                              >
                                <Phone size={16} className='me-1' />
                                <span>Call</span>
                              </a>
                            )}

                            {item.supplierBusinessDetails.whatsappNumber && (
                              <a
                                href={`https://wa.me/${item.supplierBusinessDetails.whatsappNumber}`}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='btn btn-sm btn-success d-flex align-items-center'
                              >
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  width='16'
                                  height='16'
                                  viewBox='0 0 24 24'
                                  className='me-1'
                                >
                                  <path
                                    fill='white'
                                    d='M12.011719 2C6.5057187 2 2.0234844 6.478375 2.0214844 11.984375C2.0204844 13.744375 2.4814687 15.462563 3.3554688 16.976562L2 22L7.2324219 20.763672C8.6914219 21.559672 10.333859 21.977516 12.005859 21.978516C17.514766 21.978516 21.995047 17.499141 21.998047 11.994141C22.000047 9.3251406 20.962172 6.8157344 19.076172 4.9277344C17.190172 3.0407344 14.683719 2.001 12.011719 2ZM12.009766 4C14.145766 4.001 16.153109 4.8337969 17.662109 6.3417969C19.171109 7.8517969 20.000047 9.8581875 19.998047 11.992188C19.996047 16.396187 16.413812 19.978516 12.007812 19.978516C10.674812 19.977516 9.3544062 19.642812 8.1914062 19.007812L7.5175781 18.640625 6.7734375 18.816406 4.8046875 19.28125 5.2851562 17.496094 5.5019531 16.695312 5.0878906 15.976562C4.3898906 14.768562 4.0204844 13.387375 4.0214844 11.984375 4.0234844 7.582375 7.6067656 4 12.009766 4Z'
                                  />
                                </svg>
                                <span>WhatsApp</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Product Details Column */}
                    <div className='col-12 col-md-8'>
                      <div className='mb-3'>
                        <p className='text-muted'>
                          {item.supplierBusinessDetails?.businessDescription?.join(
                            ', '
                          ) || 'No business description available'}
                        </p>
                      </div>

                      <div className='mb-4'>
                        {Object.keys(item.matchedSearchTermNames).map(
                          (key) =>
                            item?.matchedSearchTermNames[key]?.length > 0 && (
                              <div key={key} className='mb-3'>
                                <h6 className='fw-bold mb-2'>
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </h6>
                                <div className='d-flex flex-wrap gap-2'>
                                  {item.matchedSearchTermNames[key]
                                    .slice(0, 6)
                                    .map((term, index) => (
                                      <span
                                        key={index}
                                        className='badge rounded-pill bg-primary px-3 py-1'
                                      >
                                        {term}
                                      </span>
                                    ))}
                                </div>
                              </div>
                            )
                        )}
                      </div>

                      <div className='d-flex justify-content-end'>
                        <a
                          href={`/supplier-details?id=${item.supplierBusinessDetails.businessId}`}
                          className='btn btn-outline-success'
                        >
                          View Full Profile
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Filters Sidebar */}
        <div className='col-12 col-lg-4'>
          <div className='card shadow-sm mb-4'>
            <div className='card-body'>
              <h5 className='card-title fw-bold mb-3'>Filters</h5>
              <div className='mb-3'>
                <label className='form-label'>Location</label>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Filter by location'
                />
              </div>
              <div className='mb-3'>
                <label className='form-label'>Category</label>
                <select className='form-select'>
                  <option>All Categories</option>
                  <option>Category 1</option>
                  <option>Category 2</option>
                </select>
              </div>
              <button className='btn btn-primary w-100'>Apply Filters</button>
            </div>
          </div>

          <div className='card shadow-sm'>
            <div className='card-body'>
              <h5 className='card-title fw-bold mb-3'>Search Tips</h5>
              <ul className='list-unstyled'>
                <li className='mb-2'>
                  • Use specific keywords for better results
                </li>
                <li className='mb-2'>
                  • Try different variations of your search terms
                </li>
                <li className='mb-2'>
                  • Check spelling if you`re not getting results
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResult;

// card layout


const SearchResult2 = () => {
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

  if (loading) {
    return (
      <div
        className='d-flex justify-content-center align-items-center'
        style={{ minHeight: '60vh' }}
      >
        <Spinner />
      </div>
    );
  }

  return (
    <div className='container' style={{ marginTop: '6rem' }}>
      <div className='row'>
        {/* Main Content */}
        <div className='col-12'>
          {productList?.length === 0 ? (
            <div className='text-center py-5'>
              <h4>No products found</h4>
              <p className='text-muted'>Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className='row g-4'>
              {productList.map((item, idx) => (
                <div className='col-12 col-md-6 col-lg-4' key={idx}>
                  <div className='card h-100 shadow-sm border-0'>
                    {/* Business Image Header */}
                    <div
                      className='position-relative'
                      style={{ height: '180px', overflow: 'hidden' }}
                    >
                      <img
                        src={
                          item.supplierBusinessDetails.businessImagePath ||
                          '/images/logo.webp'
                        }
                        alt='Business'
                        className='img-fluid w-100 h-100'
                        style={{ objectFit: 'cover' }}
                      />
                      <div className='position-absolute bottom-0 start-0 p-2 bg-primary '>
                        <h5 className='m-0'>
                          {item.supplierBusinessDetails.businessName}
                        </h5>
                      </div>
                    </div>

                    {/* Business Details */}
                    <div className='card-body'>
                      <div className='mb-3'>
                        <div className='d-flex align-items-start mb-2'>
                          <MapPin
                            className='me-2 mt-1 text-primary'
                            size={18}
                          />
                          <div>
                            <small className='text-muted'>
                              {[
                                item.supplierBusinessDetails.address,
                                item.supplierBusinessDetails.city,
                                item.supplierBusinessDetails.country,
                              ]
                                .filter(Boolean)
                                .join(', ')}
                            </small>
                          </div>
                        </div>

                        <div className='d-flex align-items-start mb-2'>
                          <Mail className='me-2 mt-1 text-primary' size={18} />
                          <div>
                            <small>
                              {item.supplierBusinessDetails.email ||
                                'Email not provided'}
                            </small>
                          </div>
                        </div>
                      </div>

                      {/* Products/Services */}
                      <div className='mb-3'>
                        <h6 className='fw-bold mb-2'>Products/Services</h6>
                        <div className='d-flex flex-wrap gap-2'>
                          {Object.values(item.matchedSearchTermNames)
                            .flat()
                            .slice(0, 8)
                            .map((term, index) => (
                              <span
                                key={index}
                                className='badge bg-light text-dark border px-2 py-1'
                                style={{ fontSize: '0.8rem' }}
                              >
                                {term}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>

                    {/* Footer with Contact Options */}
                    <div className='card-footer bg-white border-0'>
                      <div className='d-flex justify-content-between'>
                        {item.supplierBusinessDetails.mobileNumber && (
                          <a
                            href={`tel:${item.supplierBusinessDetails.mobileNumber}`}
                            className='btn btn-sm btn-outline-primary d-flex align-items-center'
                          >
                            <Phone size={16} className='me-1' />
                            <span>Call</span>
                          </a>
                        )}

                        {item.supplierBusinessDetails.whatsappNumber && (
                          <a
                            href={`https://wa.me/${item.supplierBusinessDetails.whatsappNumber}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='btn btn-sm btn-success d-flex align-items-center'
                          >
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              width='16'
                              height='16'
                              viewBox='0 0 24 24'
                              className='me-1'
                            >
                              <path
                                fill='white'
                                d='M12.011719 2C6.5057187 2 2.0234844 6.478375 2.0214844 11.984375C2.0204844 13.744375 2.4814687 15.462563 3.3554688 16.976562L2 22L7.2324219 20.763672C8.6914219 21.559672 10.333859 21.977516 12.005859 21.978516C17.514766 21.978516 21.995047 17.499141 21.998047 11.994141C22.000047 9.3251406 20.962172 6.8157344 19.076172 4.9277344C17.190172 3.0407344 14.683719 2.001 12.011719 2ZM12.009766 4C14.145766 4.001 16.153109 4.8337969 17.662109 6.3417969C19.171109 7.8517969 20.000047 9.8581875 19.998047 11.992188C19.996047 16.396187 16.413812 19.978516 12.007812 19.978516C10.674812 19.977516 9.3544062 19.642812 8.1914062 19.007812L7.5175781 18.640625 6.7734375 18.816406 4.8046875 19.28125 5.2851562 17.496094 5.5019531 16.695312 5.0878906 15.976562C4.3898906 14.768562 4.0204844 13.387375 4.0214844 11.984375 4.0234844 7.582375 7.6067656 4 12.009766 4Z'
                              />
                            </svg>
                            <span>WhatsApp</span>
                          </a>
                        )}

                        <a
                          href={`/supplier-details?id=${item.supplierBusinessDetails.businessId}`}
                          className='btn btn-sm btn-primary'
                        >
                          View Details
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


