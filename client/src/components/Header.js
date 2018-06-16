import React from 'react';

const Header = ({ title, intro, children }) => {
	const introText = intro ? <div className="intro">{intro}</div> : null;

  return (
    <header id="header">
      <h1>{title}</h1>
      {introText}
      {children}
    </header>
  );
}

export default Header;