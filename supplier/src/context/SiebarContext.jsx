import { createContext, useContext, useState, useEffect } from 'react';

const SidebarContext = createContext();

// eslint-disable-next-line react/prop-types
export const SidebarProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    return localStorage.getItem('sb|sidebar-toggle') === 'true';
  });

  const isMobileScreen = () => window.innerWidth < 1024; // Adjust breakpoint as needed

  const toggleSidebar = () => {
    // Only toggle on non-desktop screens
    if (isMobileScreen()) {
      setIsSidebarOpen((prev) => {
        const newState = !prev;
        localStorage.setItem('sb|sidebar-toggle', newState.toString());
        return newState;
      });
    }
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.classList.add('sb-sidenav-toggled');
    } else {
      document.body.classList.remove('sb-sidenav-toggled');
    }
  }, [isSidebarOpen]);

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);
