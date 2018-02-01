import React from 'react';

const Header = props => {
  return (
    <header id="header">
      <h1>{props.title}</h1>
      {props.children}
    </header>
  );
}

export default Header;