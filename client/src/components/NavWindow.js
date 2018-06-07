import React from 'react';
import { NavLink } from 'react-router-dom';

const NavWindow = () => {
	return (
		<div id="nav-window">
			<NavLink activeClassName="current" exact to="/">Home</NavLink><br />
			<NavLink activeClassName="current" to="/box-shadow-generator">Box Shadow</NavLink><br />
			<NavLink activeClassName="current" to="/border-radius-generator">Border Radius</NavLink>
		</div>
	);
}

export default NavWindow;