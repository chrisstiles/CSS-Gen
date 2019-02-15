import React from 'react';

const Header = ({ children, defaultState, updateGenerator }) => {
  const headerProps = { id: 'header' };

  return (
    <header {...headerProps}>
      <div className="content">
        {children}
        { defaultState && updateGenerator ? 
          <div 
            className="button"
            onClick={() => { updateGenerator(defaultState); }}
          >
            Reset
          </div>
        : null}
      </div>
    </header>
  );
}

export default Header;