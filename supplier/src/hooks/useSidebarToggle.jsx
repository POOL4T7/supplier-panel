// import { useEffect } from 'react';
// import { useLocation } from 'react-router-dom';

// const useSidebarToggle = (toggleButtonId) => {
//   const location = useLocation();

//   useEffect(() => {
//     const handleSidebarToggle = (event) => {
//       event.preventDefault();
//       document.body.classList.toggle('sb-sidenav-toggled');
//       localStorage.setItem(
//         'sb|sidebar-toggle',
//         document.body.classList.contains('sb-sidenav-toggled').toString()
//       );
//     };

//     // Get the toggle button
//     const sidebarToggle = document.getElementById(toggleButtonId);

//     // Add event listener for the toggle button
//     if (sidebarToggle) {
//       sidebarToggle.addEventListener('click', handleSidebarToggle);
//     }

//     // Apply the saved state from localStorage on load
//     if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
//       document.body.classList.add('sb-sidenav-toggled');
//     }

//     // Cleanup
//     return () => {
//       if (sidebarToggle) {
//         sidebarToggle.removeEventListener('click', handleSidebarToggle);
//       }
//     };
//   }, [toggleButtonId]);

//   useEffect(() => {
//     // Hide sidebar when the route changes
//     document.body.classList.remove('sb-sidenav-toggled');
//   }, [location]);
// };

// export default useSidebarToggle;

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSidebar } from '../context/SiebarContext';

const useSidebarToggle = (toggleButtonId) => {
  const { toggleSidebar } = useSidebar();
  const location = useLocation();

  useEffect(() => {
    const sidebarToggle = document.getElementById(toggleButtonId);
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', toggleSidebar);
    }

    return () => {
      if (sidebarToggle) {
        sidebarToggle.removeEventListener('click', toggleSidebar);
      }
    };
  }, [toggleButtonId, toggleSidebar]);

  useEffect(() => {
    // Hide sidebar on route change
    document.body.classList.remove('sb-sidenav-toggled');
  }, [location]);
};

export default useSidebarToggle;
