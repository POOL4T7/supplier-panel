import { Link } from 'react-router-dom';
import { useAtom } from 'jotai';
import { userDetailsAtom } from '../../storges/user';
// import { useState } from 'react';

const Header = () => {
  const [userDetails] = useAtom(userDetailsAtom);
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
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarColor02'
          aria-controls='navbarColor02'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>

        {/* Navbar Links & Controls */}
        <div className='collapse navbar-collapse' id='navbarColor02'>
          <ul className='navbar-nav me-auto'>
            {/* Additional nav items can go here */}
          </ul>

          <div className='d-flex align-items-center'>
            {/* Country Dropdown */}
            {/* <div className='dropdown me-3'>
              <button
                className='btn btn-light dropdown-toggle d-flex align-items-center country-dropdown bg-primary border-primary'
                type='button'
                id='countryDropdown'
                data-bs-toggle='dropdown'
                aria-expanded='false'
                // style={{}}
              >
                <img
                  src={`https://flagcdn.com/w40/${
                    countries.find((c) => c.name === selectedCountry)?.code
                  }.png`}
                  alt={selectedCountry}
                  className='me-2'
                  style={{ width: '24px', height: '16px' }}
                />
              </button>
              <ul
                className='dropdown-menu dropdown-menu-end'
                aria-labelledby='countryDropdown'
              >
                {countries.map((country, index) => (
                  <li key={index}>
                    <button
                      className='dropdown-item d-flex align-items-center'
                      onClick={() => {
                        setSelectedCountry(country.name);
                        localStorage.setItem('country', country.name);
                      }}
                    >
                      <img
                        src={`https://flagcdn.com/w40/${country.code}.png`}
                        alt={country.name}
                        className='me-2'
                        style={{ width: '24px', height: '16px' }}
                      />
                      {country.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div> */}

            {/* User Dropdown */}
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
              <Link to='/signin' className='nav-link text-white p-3'>
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
