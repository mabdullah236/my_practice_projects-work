import React from 'react';
import PublicNavbar from './PublicNavbar'; // <--- Naya Navbar Import kiya
// import Footer from './Footer'; // Assuming Footer wahin hai

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Landing Page Navbar */}
      <PublicNavbar />
      
      {/* Page Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
};

export default MainLayout;