import { Link } from 'react-router-dom';
import { useAtom } from 'jotai';
import { userDetailsAtom } from '../../../storges/user';
import { MenuIcon, User, X as CancelIcon } from 'lucide-react';
import useSidebarToggle from '../../../hooks/useSidebarToggle';
import { useState } from 'react';

const Header = () => {
  const [userDetails] = useAtom(userDetailsAtom);
  useSidebarToggle('sidebarToggle', 'sidebarToggle');
  const [showSidebar, setshowSidebar] = useState(false);
  return (
    <>
      <nav className='sb-topnav navbar navbar-expand shadow-sm'>
        <div className='container-fluid'>
          <Link to={'/admin/profile'}>
            <img src='/images/logo.webp' alt='logo' width='65' height='60' />
          </Link>

          <button
            className='btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0 text-white d-lg-none'
            id='sidebarToggle'
            href='#!'
            onClick={() => setshowSidebar(!showSidebar)}
          >
            {showSidebar ? <CancelIcon /> : <MenuIcon />}
            {/* <MenuIcon /> */}
          </button>

          <div className='d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0'>
            {/* <div className='input-group'>
            <input
              className='form-control'
              type='text'
              placeholder='Search for...'
              aria-label='Search for...'
              aria-describedby='btnNavbarSearch'
            />
            <button
              className='btn btn-primary'
              id='btnNavbarSearch'
              type='button'
            >
            </button>
          </div> */}
          </div>

          <ul className='navbar-nav ms-auto ms-md-0 me-3 me-lg-4'>
            {userDetails ? (
              <li className='nav-item dropdown'>
                <a
                  className='nav-link dropdown-toggle text-white'
                  id='navbarDropdown'
                  href='#'
                  role='button'
                  data-bs-toggle='dropdown'
                  aria-expanded='false'
                >
                  <User />
                </a>
                <ul
                  className='dropdown-menu dropdown-menu-end'
                  aria-labelledby='navbarDropdown'
                >
                  <li>
                    <Link className='dropdown-item' to='/admin'>
                      Profile
                    </Link>
                  </li>

                  <li>
                    <hr className='dropdown-divider' />
                  </li>
                  <li>
                    <button
                      className='dropdown-item'
                      onClick={() => {
                        localStorage.removeItem('user');
                        window.location.href = '/';
                      }}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <Link to={'/signin'} className='nav-link text-primary mr-2'>
                login
              </Link>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Header;
