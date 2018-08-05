import React from 'react';
import { NavLink } from 'react-router-dom';
import SVGInline from 'react-svg-inline';
import logo from '../images/logo.svg';

const NavWindow = () => {
	return (
		<div id="nav-window">
			<NavLink activeClassName="current" exact to="/" className="logo">
				<SVGInline svg={logo} />
			</NavLink>

			<NavLink activeClassName="current" exact to="/">Home</NavLink><br />
			<NavLink activeClassName="current" to="/box-shadow-generator">Box Shadow</NavLink><br />
			<NavLink activeClassName="current" to="/border-radius-generator">Border Radius</NavLink><br />
      <NavLink activeClassName="current" to="/gradient-generator">Gradient</NavLink>
		</div>
	);
}

export default NavWindow;