import React from 'react';
import ReactDOM from 'react-dom';
import ReactSelect from './VirtualizedSelect';
// import ReactSelect from 'react-virtualized-select';
// import ReactSelect from 'react-select';
import AsyncSelect from 'react-select/lib/Async';
import 'react-select/dist/react-select.css';
// import 'react-virtualized-select/styles.css';
// import defaultMenuRenderer from 'react-select/lib/utils/defaultMenuRenderer';
import defaultMenuRenderer from 'react-select/lib/utils/defaultMenuRenderer';
import _ from 'underscore';

class Select extends React.Component {
	constructor(props) {
		super(props);

		this.handleChange = this.handleChange.bind(this);
		this.handleOpen = this.handleOpen.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
		this.getWrapperStyles = this.getWrapperStyles.bind(this);
		this.scrollMenu = this.scrollMenu.bind(this);
		this.renderMenu = this.renderMenu.bind(this);
	}

	componentDidMount() {
		this.menuContainer = document.querySelector(this.props.menuContainer);

		// if (!this.select.control) {
		// 	this.select = this.select.select;
		// }
		
		if (this.menuContainer) {
			this.scrollWrapper = this.props.scrollWrapper ? document.querySelector(this.props.scrollWrapper) : this.menuContainer;

			window.addEventListener('scroll', this.scrollMenu, true);
			window.addEventListener('resize', this.scrollMenu, true);
		}
	}

	componentWillUnmount(){
		if (this.menuContainer) {
			window.removeEventListener('scroll', this.scrollMenu, true);
			window.removeEventListener('resize', this.scrollMenu, true);
		}
	}

	scrollMenu(event) {
		if (!this.wrapper) {
			return;
		}

		if (event.type === 'resize' || event.target === this.menuContainer || this.menuContainer.contains(event.target)) {
			const styles = this.getWrapperStyles(event.target);

			this.wrapper.style.top = `${styles.top}px`;
			this.wrapper.style.maxHeight = `${styles.maxHeight}px`;
		}
	}

	handleChange(selectedOption) {
		const value = selectedOption ? selectedOption.value : '';
		this.props.onChange(value, this.props.name);
	}

	handleOpen() {
		if (this.props.onOpen) {
			this.props.onOpen();
		}
	}

	handleFocus(event) {
		this.control = event.target;
	}

	getWrapperStyles() {

		// console.log(this.select)

		const select = this.select._selectRef;
		console.log(select)
		if (select) {
			const control = select ? select : select.select.control;
			console.log(control)
			const selectRect = control.getBoundingClientRect();
			const containerRect = this.scrollWrapper.getBoundingClientRect();
			const borderLeftWidth = getComputedStyle(this.scrollWrapper, null).getPropertyValue('border-left-width');
			const scrollWrapperHeight = containerRect.height;

			var top = selectRect.top + selectRect.height;
			if (top >= (containerRect.top + scrollWrapperHeight)) {
				top = containerRect.top + scrollWrapperHeight;
			}

			var maxHeight = window.innerHeight - top - 35;

			if (maxHeight > 350) {
				maxHeight = 350;
			}

			const style = {
				width: selectRect.width,
				top: top,
				left: selectRect.left - containerRect.left + parseInt(borderLeftWidth, 10),
				maxHeight: maxHeight
			}

			return style;
		}

	}

	renderMenu(menu) {
		console.log('renderMenu()')
		console.log(menu)
		// const options = defaultMenuRenderer(params);
		
		var className = 'menu-wrapper';
		if (this.props.className && this.props.className.indexOf('small') !== -1) {
			className += ' small';
		}
		console.log(this.select)
		if (this.menuContainer) {
			const style = this.getWrapperStyles();
			// const style = {};
			className += ' has-container';

			const menuWrapper = (
				<div 
					className={className}
					style={style}
					ref={wrapper => { this.wrapper = wrapper }}
				>
					{menu}
				</div>
			);

			return ReactDOM.createPortal(
		    menu,
		    this.menuContainer
		  );
		} else {
			const menuWrapper = (
				<div className={className}>
					{menu}
				</div>
			);

			return menuWrapper;
		}
	}

	render() {
		var className = 'field-wrapper select-wrapper';

		if (this.props.className) {
			className += ` ${this.props.className}`;
		}

		const props = _.extend({}, this.props, { onChange: this.handleChange, className: '' });

		return(
			<div className={className}>
				{this.props.label ? <label className="title">{this.props.label}</label> : null}
				
				<ReactSelect
					ref={select => { this.select = select }}
					onFocus={this.handleFocus}
					onOpen={this.handleOpen}
					renderMenu={this.renderMenu}
					clearable={false}
					{...props}
				/>
			</div>
		);
	}
}

export default Select;