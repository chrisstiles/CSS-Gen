import React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../images/logo.svg';

const navLinks = [
	{ to: '/flexbox-generator', className: 'gradient', title: 'Flexbox' },
	{ to: '/transform-generator', className: 'gradient', title: 'Transform' },
	{ to: '/box-shadow-generator', className: 'box-shadow', title: 'Box Shadow' },
	{ to: '/border-radius-generator', className: 'border-radius', title: 'Border Radius' },
	{ to: '/gradient-generator', className: 'gradient', title: 'Gradient' },
	{ to: '/filter-generator', className: 'gradient', title: 'CSS Filters' },
	{ to: '/triangle-generator', className: 'gradient', title: 'Triangle' },
	{ to: '/text-shadow', className: 'text-shadow', title: 'Text Shadow' }
];

class Navigation extends React.PureComponent {
	render() {
		const navLinkComponents = navLinks.map(({ to, className, title }) => {
			return (
				<NavLink
					activeClassName="current"
					to={to}
					key={to}
					className={className}
					onClick={this.handleClick}
				>
					{title}
				</NavLink>
			);
		});

		return (
			<nav id="navigation">
				<NavLink activeClassName="current" exact to="/" className="logo">
					<Logo />
				</NavLink>

				<div id="page-links">{navLinkComponents}</div>
			</nav>
		);
	}
}

export default Navigation;