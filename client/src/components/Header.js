import React from 'react';

const Header = ({ children }) => {
  const headerProps = { id: 'header' };

  return (
    <header {...headerProps}>
      <div className="content">
        {children}
      </div>
    </header>
  );
}

export default Header;