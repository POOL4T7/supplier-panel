import { Link } from 'react-router-dom';
import { useAtom } from 'jotai';
import { userDetailsAtom } from '../../../storges/user';
// import { MenuIcon, User } from 'lucide-react';
import useSidebarToggle from '../../../hooks/useSidebarToggle';
import { useState } from 'react';
import AccountDelete from '../../user/AccountDelete';
import { User } from 'lucide-react';

const Header = () => {
  const [userDetails] = useAtom(userDetailsAtom);
  const [open, setOpen] = useState(false);
  useSidebarToggle('sidebarToggle', 'sidebarToggle');

  const handleClickOpen = () => {
    setOpen(!open);
  };
  return (
    <>
      <nav className='sb-topnav navbar navbar-expand navbar-dark bg-dark'>
        <Link className='navbar-brand ps-3' to='/'>
          <img src='images/logo.webp' alt='hello' width='45' height='45' />
        </Link>

        {/* <button
          className='btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0'
          id='sidebarToggle'
          href='#!'
        >
          <MenuIcon />
        </button> */}

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
                className='nav-link dropdown-toggle'
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
                  <Link className='dropdown-item' to='/user/profile'>
                    Profile
                  </Link>
                </li>
                {/* <li>
                  <hr className='dropdown-divider' />
                </li> */}
                <li>
                  <div
                    className='dropdown-item'
                    style={{
                      cursor: 'pointer',
                      color: 'red',
                      backgroundColor: 'transparent',
                    }}
                    onClick={handleClickOpen}
                  >
                    Delete
                  </div>
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
      </nav>

      {open && <AccountDelete open={open} setOpen={handleClickOpen} />}
    </>
  );
};

export default Header;
