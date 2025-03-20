import { useAtom } from 'jotai';
import {
  ChartNoAxesGantt,
  ChevronDown,
  PackageOpen,
  Trash,
  UserCog,
  UserRoundPen,
} from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { bussinessProfile } from '../../../storges/user';
import { useState } from 'react';
import DialogModal from '../../common/DialogModal';

const Sidebar = () => {
  const location = useLocation();
  const [bussiness] = useAtom(bussinessProfile);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(!open);
  };
  return (
    <div id='layoutSidenav'>
      <div id='layoutSidenav_nav'>
        <nav className='sb-sidenav accordion shadow' id='sidenavAccordion'>
          <div className='sb-sidenav-menu'>
            <div className='nav'>
              <div className='sb-sidenav-menu-heading'>Screens</div>
              <Link
                className={`nav-link ${
                  location.pathname === '/supplier/profile' ? 'nav-active' : ''
                }`}
                to='/supplier/profile'
              >
                <div className='sb-nav-link-icon'>
                  <UserRoundPen />
                </div>
                Supplier Profile
              </Link>
              {/* <Link className='nav-link' to='/supplier/bussiness-profile'>
                <div className='sb-nav-link-icon'>
                  <UserRoundPen />
                </div>
                Bussiness Profile
              </Link> */}
              <Link
                className={`nav-link collapsed ${
                  [
                    '/supplier/bussiness/profile',
                    '/supplier/bussiness/address',
                    '/supplier/bussiness/contact',
                    '/supplier/bussiness/tax-details',
                    '/supplier/bussiness/verify',
                  ].includes(location.pathname)
                    ? 'nav-active'
                    : ''
                }`}
                href='#'
                data-bs-toggle='collapse'
                data-bs-target='#bussinessLayout'
                aria-expanded='false'
                aria-controls='bussinessLayout'
              >
                <div className='sb-nav-link-icon'>
                  <ChartNoAxesGantt />
                </div>
                Bussiness Profile
                <div className='sb-sidenav-collapse-arrow'>
                  <ChevronDown />
                </div>
              </Link>
              <div
                className='collapse'
                id='bussinessLayout'
                aria-labelledby='headingZero'
                data-bs-parent='#sidenavAccordion'
              >
                <nav className='sb-sidenav-menu-nested nav'>
                  <Link
                    className={`nav-link ${
                      location.pathname === '/supplier/bussiness/profile'
                        ? 'nav-active'
                        : ''
                    }`}
                    to='/supplier/bussiness/profile'
                  >
                    About business
                  </Link>
                  <Link
                    className={`nav-link ${
                      location.pathname === '/supplier/bussiness/address'
                        ? 'nav-active'
                        : ''
                    }`}
                    to='/supplier/bussiness/address'
                  >
                    Business address
                  </Link>
                  <Link
                    className={`nav-link ${
                      location.pathname === '/supplier/bussiness/contact'
                        ? 'nav-active'
                        : ''
                    }`}
                    to='/supplier/bussiness/contact'
                  >
                    Contact details
                  </Link>
                  <Link
                    className={`nav-link ${
                      location.pathname === '/supplier/bussiness/tax-details'
                        ? 'nav-active'
                        : ''
                    }`}
                    to='/supplier/bussiness/tax-details'
                  >
                    Legal/tax details
                  </Link>
                  <Link
                    className={`nav-link ${
                      location.pathname === '/supplier/bussiness/verify'
                        ? 'nav-active'
                        : ''
                    }`}
                    to='/supplier/bussiness/verify'
                  >
                    Verify the business
                  </Link>
                </nav>
              </div>
              {/* <div className='sb-sidenav-menu-heading'>Product</div> */}
              <Link
                className={`nav-link collapsed ${
                  [
                    '/supplier/product-category',
                    '/supplier/product-subcategory',
                    '/supplier/products',
                  ].includes(location.pathname)
                    ? 'nav-active'
                    : ''
                }`}
                href='#'
                data-bs-toggle='collapse'
                data-bs-target='#collapseLayouts'
                aria-expanded='false'
                aria-controls='collapseLayouts'
              >
                <div className='sb-nav-link-icon'>
                  <PackageOpen />
                </div>
                Product
                <div className='sb-sidenav-collapse-arrow'>
                  <ChevronDown />
                </div>
              </Link>
              <div
                className='collapse'
                id='collapseLayouts'
                aria-labelledby='headingOne'
                data-bs-parent='#sidenavAccordion'
              >
                <nav className='sb-sidenav-menu-nested nav'>
                  <Link
                    className={`nav-link ${
                      location.pathname === '/supplier/product-category'
                        ? 'nav-active'
                        : ''
                    }`}
                    to='/supplier/product-category'
                  >
                    Category
                  </Link>
                  <Link
                    className={`nav-link ${
                      location.pathname === '/supplier/product-subcategory'
                        ? 'nav-active'
                        : ''
                    }`}
                    to='/supplier/product-subcategory'
                  >
                    Sub Category
                  </Link>
                  <Link
                    className={`nav-link ${
                      location.pathname === '/supplier/products'
                        ? 'nav-active'
                        : ''
                    }`}
                    to='/supplier/products'
                  >
                    Products List
                  </Link>
                </nav>
              </div>
              <Link
                className={`nav-link collapsed ${
                  bussiness.sector === 'services' ||
                  bussiness.sector === 'products and services'
                    ? ''
                    : 'disabled'
                }   ${
                  [
                    '/supplier/service-category',
                    '/supplier/service-subcategory',
                    '/supplier/services',
                  ].includes(location.pathname)
                    ? 'nav-active'
                    : ''
                }`}
                href='#'
                data-bs-toggle='collapse'
                data-bs-target='#supplierLayout'
                aria-expanded='false'
                aria-controls='supplierLayout'
                disabled={
                  !(
                    bussiness.sector === 'services' ||
                    bussiness.sector === 'products and services'
                  )
                }
              >
                <div className='sb-nav-link-icon'>
                  <UserCog />
                </div>
                Services
                <div className='sb-sidenav-collapse-arrow'>
                  <ChevronDown />
                </div>
              </Link>
              <div
                className='collapse'
                id='supplierLayout'
                aria-labelledby='headingOne'
                data-bs-parent='#sidenavAccordion'
              >
                <nav className='sb-sidenav-menu-nested nav'>
                  <Link
                    className={`nav-link ${
                      location.pathname === '/supplier/service-category'
                        ? 'nav-active'
                        : ''
                    }`}
                    to='/supplier/service-category'
                  >
                    Category
                  </Link>
                  <Link
                    className={`nav-link ${
                      location.pathname === '/supplier/service-subcategory'
                        ? 'nav-active'
                        : ''
                    }`}
                    to='/supplier/service-subcategory'
                  >
                    Sub Category
                  </Link>
                  <Link
                    className={`nav-link ${
                      location.pathname === '/supplier/services'
                        ? 'nav-active'
                        : ''
                    }`}
                    to='/supplier/services'
                  >
                    Service List
                  </Link>
                </nav>
              </div>
              <Link
                className={`nav-link ${
                  location.pathname === '/supplier/account-activation'
                    ? 'nav-active'
                    : ''
                }`}
                to='/supplier/account-activation'
              >
                <div className='sb-nav-link-icon'>
                  <UserRoundPen />
                </div>
                Activate/ deactivate
              </Link>
              <Link className={`nav-link`} to='#' onClick={handleClickOpen}>
                <div className='sb-nav-link-icon'>
                  <Trash color='red' />
                </div>
                Delete
              </Link>

              {/* <a
                className='nav-link collapsed'
                href='#'
                data-bs-toggle='collapse'
                data-bs-target='#collapsePages'
                aria-expanded='false'
                aria-controls='collapsePages'
              >
                <div className='sb-nav-link-icon'>
                  <i className='fas fa-book-open'></i>
                </div>
                Pages
                <div className='sb-sidenav-collapse-arrow'>
                  <i className='fas fa-angle-down'></i>
                </div>
              </a>
              <div
                className='collapse'
                id='collapsePages'
                aria-labelledby='headingTwo'
                data-bs-parent='#sidenavAccordion'
              >
                <nav
                  className='sb-sidenav-menu-nested nav accordion'
                  id='sidenavAccordionPages'
                >
                  <a
                    className='nav-link collapsed'
                    href='#'
                    data-bs-toggle='collapse'
                    data-bs-target='#pagesCollapseAuth'
                    aria-expanded='false'
                    aria-controls='pagesCollapseAuth'
                  >
                    Authentication
                    <div className='sb-sidenav-collapse-arrow'>
                      <i className='fas fa-angle-down'></i>
                    </div>
                  </a>
                  <div
                    className='collapse'
                    id='pagesCollapseAuth'
                    aria-labelledby='headingOne'
                    data-bs-parent='#sidenavAccordionPages'
                  >
                    <nav className='sb-sidenav-menu-nested nav'>
                      <a className='nav-link' href='login.html'>
                        Login
                      </a>
                      <a className='nav-link' href='register.html'>
                        Register
                      </a>
                      <a className='nav-link' href='password.html'>
                        Forgot Password
                      </a>
                    </nav>
                  </div>
                  <a
                    className='nav-link collapsed'
                    href='#'
                    data-bs-toggle='collapse'
                    data-bs-target='#pagesCollapseError'
                    aria-expanded='false'
                    aria-controls='pagesCollapseError'
                  >
                    Error
                    <div className='sb-sidenav-collapse-arrow'>
                      <i className='fas fa-angle-down'></i>
                    </div>
                  </a>
                  <div
                    className='collapse'
                    id='pagesCollapseError'
                    aria-labelledby='headingOne'
                    data-bs-parent='#sidenavAccordionPages'
                  >
                    <nav className='sb-sidenav-menu-nested nav'>
                      <a className='nav-link' href='401.html'>
                        401 Page
                      </a>
                      <a className='nav-link' href='404.html'>
                        404 Page
                      </a>
                      <a className='nav-link' href='500.html'>
                        500 Page
                      </a>
                    </nav>
                  </div>
                </nav>
              </div> */}
              {/* <div className='sb-sidenav-menu-heading'>Addons</div> */}
              {/* <a className='nav-link' href='charts.html'>
                <div className='sb-nav-link-icon'>
                  <i className='fas fa-chart-area'></i>
                </div>
                Charts
              </a>
              <a className='nav-link' href='tables.html'>
                <div className='sb-nav-link-icon'>
                  <i className='fas fa-table'></i>
                </div>
                Tables
              </a> */}
            </div>
          </div>
          {/* <div className='sb-sidenav-footer'>
              <div className='small'>Logged in as:</div>
              Start Bootstrap
            </div> */}
        </nav>
      </div>
      <div id='layoutSidenav_content'>
        <main>
          <div className='container-fluid px-4'>
            <Outlet />
          </div>
        </main>
        {/* <footer className='py-4 bg-light mt-auto'>
            <div className='container-fluid px-4'>
              <div className='d-flex align-items-center justify-content-between small'>
                <div className='text-muted'>Copyright &copy; Your Website 2023</div>
                <div>
                  <a href='#'>Privacy Policy</a>
                  &middot;
                  <a href='#'>Terms &amp; Conditions</a>
                </div>
              </div>
            </div>
          </footer> */}
      </div>
      {open && <DialogModal open={open} setOpen={handleClickOpen} />}
    </div>
  );
};

export default Sidebar;
