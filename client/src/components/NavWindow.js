import React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../images/logo.svg';

const navLinks = [
	{ to: '/box-shadow-generator', className: 'box-shadow', title: 'Box Shadow' },
	{ to: '/border-radius-generator', className: 'border-radius', title: 'Border Radius' },
	{ to: '/gradient-generator', className: 'gradient', title: 'Gradient' },
	{ to: '/filter-generator', className: 'gradient', title: 'CSS Filters' },
	{ to: '/triangle-generator', className: 'gradient', title: 'Triangle' }
];

const NavWindow = () => {
	const navLinkComponents = navLinks.map(({ to, className, title }) => {
	  return (
	    <NavLink
	      activeClassName="current"
	      to={to}
	      key={to}
	      className={className}
	    >
	    	{title}
	    </NavLink>
	  );
	});

	return (
		<div id="nav-window">
			<NavLink activeClassName="current" exact to="/" className="logo">
				<Logo />
			</NavLink>

			<div id="page-links">
				<h2>CSS Generators</h2>
				{navLinkComponents}
      </div>
		</div>
	);
}

export default NavWindow;