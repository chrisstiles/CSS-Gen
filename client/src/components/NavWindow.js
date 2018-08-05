import React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../images/logo.svg';

const NavWindow = () => {
	return (
		<div id="nav-window">
			<NavLink activeClassName="current" exact to="/" className="logo">
				<Logo />
			</NavLink>

			<div id="page-links">
				<h2>CSS Generators</h2>
				<NavLink activeClassName="current" className="box-shadow" to="/box-shadow-generator">Box Shadow</NavLink>
				<NavLink activeClassName="current" className="border-radius" to="/border-radius-generator">Border Radius</NavLink>
	      <NavLink activeClassName="current" className="gradient" to="/gradient-generator">Gradient</NavLink>
      </div>
		</div>
	);
}

export default NavWindow;