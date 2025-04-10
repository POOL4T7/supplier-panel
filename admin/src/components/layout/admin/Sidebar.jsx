import { Link, Outlet, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  return (
    <div id='layoutSidenav'>
      <div id='layoutSidenav_nav'>
        <nav className='sb-sidenav accordion shadow' id='sidenavAccordion'>
          <div className='sb-sidenav-menu'>
            <div className='nav'>
              <div className='sb-sidenav-menu-heading'>Pages</div>
              <Link
                className={`nav-link ${
                  location.pathname === '/admin/supplier-list'
                    ? 'nav-active'
                    : ''
                }`}
                to='/admin/supplier-list'
              >
                <div className='sb-nav-link-icon'>
                  <i className='fas fa-tachometer-alt'></i>
                </div>
                Supplier List
              </Link>
              <Link
                className={`nav-link ${
                  location.pathname === '/admin/premises-list'
                    ? 'nav-active'
                    : ''
                }`}
                to='/admin/premises-list'
              >
                <div className='sb-nav-link-icon'>
                  <i className='fas fa-tachometer-alt'></i>
                </div>
                Premises
              </Link>
              <div className='sb-sidenav-menu-heading'></div>
              {/* 
              <a
                className='nav-link collapsed'
                href='#'
                data-bs-toggle='collapse'
                data-bs-target='#collapseLayouts'
                aria-expanded='false'
                aria-controls='collapseLayouts'
              >
                <div className='sb-nav-link-icon'>
                  <i className='fas fa-columns'></i>
                </div>
                Layouts
                <div className='sb-sidenav-collapse-arrow'>
                  <i className='fas fa-angle-down'></i>
                </div>
              </a>
              <div
                className='collaps'
                id='collapseLayouts'
                aria-labelledby='headingOne'
                data-bs-parent='#sidenavAccordion'
              >
                <nav className='sb-sidenav-menu-nested nav'>
                  <a className='nav-link' href='layout-static.html'>
                    Static Navigation
                  </a>
                  <a className='nav-link' href='layout-sidenav-light.html'>
                    Light Sidenav
                  </a>
                </nav>
              </div> */}
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
              </a> */}
              {/* <div
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
    </div>
  );
};

export default Sidebar;
