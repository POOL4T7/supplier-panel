import { Link } from 'react-router-dom';
// import { useAtom } from 'jotai';
// import { userDetailsAtom } from '../../storges/user';
// import { MenuIcon } from 'lucide-react';
// import { useState } from 'react';

const Header = () => {
  // const [userDetails] = useAtom(userDetailsAtom);
  // const [selectedCountry, setSelectedCountry] = useState(
  //   localStorage.getItem('country') || 'Germany'
  // );

  // const countries = [
  //   { name: 'Germany', code: 'de' },
  //   { name: 'France', code: 'fr' },
  //   { name: 'USA', code: 'us' },
  //   { name: 'India', code: 'in' },
  //   { name: 'UK', code: 'gb' },
  //   { name: 'Canada', code: 'ca' },
  // ];

  return (
    <nav
      className='sb-topnav navbar navbar-expand-lg fixed-top shadow-sm'
      // style={{ backgroundColor: "#424e2c" }}
    >
      <div className='container-fluid'>
        {/* Logo */}
        <Link to={'/'}>
          <img src='/images/logo.webp' alt='logo' width='65' height='60' />
        </Link>

        {/* Navbar Toggler for Mobile */}
        {/* <button
          className='navbar-toggler text-white'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarColor02'
          aria-controls='navbarColor02'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <MenuIcon />
        </button>

        <div className='collapse navbar-collapse' id='navbarColor02'>
          <ul className='navbar-nav me-auto'>
          </ul>

          <div className='d-flex align-items-center'>
            {userDetails?.id ? (
              <ul className='navbar-nav'>
                <li className='nav-item dropdown'>
                  <a
                    className='nav-link dropdown-toggle '
                    data-bs-toggle='dropdown'
                    href='#'
                    role='button'
                    aria-haspopup='true'
                    aria-expanded='false'
                    style={{
                      color: 'green',
                    }}
                  >
                    {userDetails.supplierName}
                  </a>
                  <div className='dropdown-menu dropdown-menu-end'>
                    <Link
                      className='dropdown-item'
                      to={`${JSON.parse(
                        localStorage.getItem('user')
                      )?.userType?.toLowerCase()}/profile`}
                    >
                      Dashboard
                    </Link>
                    <div className='dropdown-divider'></div>
                    <button
                      className='dropdown-item'
                      onClick={() => {
                        localStorage.removeItem('user');
                        window.location.href = '/';
                      }}
                    >
                      Logout
                    </button>
                  </div>
                </li>
              </ul>
            ) : (
              <Link to='/signin' className='nav-link text-white px-3'>
                <div className='d-flex justify-content-center'>
                  <img
                    src='/images/supplier.webp'
                    style={{
                      width: '25px',
                      height: '25px',
                      borderRadius: '50%',
                    }}
                  />{' '}
                </div>
                login
              </Link>
            )}
          </div>
        </div> */}
      </div>
    </nav>
  );
};

export default Header;
