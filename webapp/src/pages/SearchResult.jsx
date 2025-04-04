import axios from 'axios';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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
    <div className='container py-4' style={{ marginTop: '6rem' }}>
      <div className='row'>
        <div className='col-12 col-md-9'>
          {productList?.length === 0 ? (
            <div className='text-center py-5'>
              <h4>No products found</h4>
              <p className='text-muted'>Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className='d-flex flex-column gap-4'>
              {productList.map((item, idx) => (
                <div className='card shadow-sm border-0' key={idx}>
                  <div className='row g-0'>
                    {/* Image Column */}
                    <div
                      className='col-12 col-md-4 position-relative'
                      style={{ minHeight: '200px' }}
                    >
                      <img
                        src={
                          item.supplierBusinessDetails.businessImagePath ||
                          '/images/logo.webp'
                        }
                        alt='Business'
                        className='img-fluid h-100 w-100'
                        style={{ objectFit: 'cover' }}
                      />
                    </div>

                    {/* Content Column */}
                    <div className='col-12 col-md-8'>
                      <div
                        className='card-body h-100 d-flex flex-column p-3 p-md-4'
                        style={{ backgroundColor: '#f8f9fa' }}
                      >
                        {/* Business Name */}
                        <h4 className='fw-bold text-primary mb-3'>
                          {item.supplierBusinessDetails.businessName}
                        </h4>
                        {/* Address */}
                        <div className='d-flex align-items-start mb-2'>
                          <MapPin
                            className='me-2 mt-1 text-primary flex-shrink-0'
                            size={15}
                          />
                          <span className='text-muted small'>
                            {[
                              item.supplierBusinessDetails.address,
                              item.supplierBusinessDetails.city,
                              item.supplierBusinessDetails.country,
                            ]
                              .filter(Boolean)
                              .join(', ')}
                          </span>
                        </div>

                        {/* Business Description */}
                        {item.supplierBusinessDetails?.businessDescription
                          ?.length > 0 && (
                          <div className='mb-3'>
                            <p className='small text-muted mb-0'>
                              {item.supplierBusinessDetails.businessDescription.join(
                                ', '
                              )}
                            </p>
                          </div>
                        )}

                        {/* Products/Services */}
                        <div className='mb-3'>
                          <h6 className='fw-bold mb-2 small'>
                            Products & Services
                          </h6>
                          <div className='d-flex flex-wrap gap-2'>
                            {Object.values(item.matchedSearchTermNames)
                              .flat()
                              .slice(0, 12)
                              .map((term, index) => (
                                <span
                                  key={index}
                                  className='badge bg-light text-dark border px-2 py-1 small'
                                >
                                  {term}
                                </span>
                              ))}
                          </div>
                        </div>

                        {/* Contact Information */}
                        <div className='mt-auto pt-2'>
                          <div className='d-flex flex-wrap justify-content-between align-items-center'>
                            <div className='d-flex flex-wrap gap-2 mb-2 mb-md-0'>
                              {item.supplierBusinessDetails.mobileNumber ? (
                                <a
                                  href={`tel:${item.supplierBusinessDetails.mobileNumber}`}
                                  className='btn btn-sm btn-outline-primary d-flex align-items-center'
                                >
                                  <Phone size={16} className='me-1' />
                                  <span className='d-none d-sm-inline'>
                                    Call
                                  </span>
                                </a>
                              ) : (
                                <></>
                              )}

                              {item.supplierBusinessDetails.whatsappNumber ? (
                                <a
                                  href={`https://wa.me/${item.supplierBusinessDetails.whatsappNumber}`}
                                  target='_blank'
                                  rel='noopener noreferrer'
                                  className='btn btn-sm btn-success d-flex align-items-center'
                                >
                                  <span>WhatsApp</span>
                                </a>
                              ) : (
                                <></>
                              )}

                              {item.supplierBusinessDetails.email ? (
                                <a
                                  href={`mailto:${item.supplierBusinessDetails.email}`}
                                  className='btn btn-sm btn-outline-secondary d-flex align-items-center'
                                >
                                  <Mail size={16} className='me-1' />
                                  <span className='d-none d-sm-inline'>
                                    Email
                                  </span>
                                </a>
                              ) : (
                                <></>
                              )}
                            </div>

                            <Link
                              to={`/supplier-details?id=${item.supplierBusinessDetails.businessId}`}
                              className='btn btn-sm btn-primary ms-auto'
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className='col-12 col-md-3'>
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
