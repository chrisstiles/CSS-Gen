import React from 'react';
import ReactDOM from 'react-dom';
import VirtualizedSelect from './VirtualizedSelect';
import 'react-select/dist/react-select.css';
import _ from 'underscore';

class Select extends React.Component {
	constructor(props) {
		super(props);

		this.handleChange = this.handleChange.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
		this.handleOpen = this.handleOpen.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.getWrapperStyles = this.getWrapperStyles.bind(this);
		this.scrollMenu = this.scrollMenu.bind(this);
		this.renderMenu = this.renderMenu.bind(this);
	}

	componentDidMount() {
		this.menuContainer = document.querySelector(this.props.menuContainer);

		if (this.menuContainer) {
			this.scrollWrapper = this.props.scrollWrapper ? document.querySelector(this.props.scrollWrapper) : this.menuContainer;

			window.addEventListener('scroll', this.scrollMenu, true);
			window.addEventListener('resize', this.scrollMenu, true);
		}
	}

	componentWillUnmount(){
		window.removeEventListener('scroll', this.scrollMenu, true);
		window.removeEventListener('resize', this.scrollMenu, true);
	}

	scrollMenu(event) {
		if (!this.wrapper) {
			return;
		}

		if (event.type === 'resize' || event.target === this.menuContainer || this.menuContainer.contains(event.target)) {
			const styles = this.getWrapperStyles();

			this.wrapper.style.top = `${styles.top}px`;
			this.wrapper.style.maxHeight = `${styles.maxHeight}px`;
		}
	}

	handleChange(selectedOption) {
		const value = selectedOption ? selectedOption.value : '';
		this.props.onChange(value, this.props.name);
	}

	handleFocus(e) {
		this.input = e.target;

		if (this.props.onFocus) {
			this.props.onFocus();
		}
	}

	handleOpen() {
		// setTimeout(() => {
		// 	debugger;
		// }, 1000)
		if (this.props.onOpen) {
			this.props.onOpen();
		}
	}

	handleClose() {
		if (this.props.onClose) {
			this.props.onClose();
		}
	}

	getWrapperStyles() {
		if (this.control) {
			const selectRect = this.control.getBoundingClientRect();
			const containerRect = this.scrollWrapper.getBoundingClientRect();
			const borderLeftWidth = getComputedStyle(this.scrollWrapper, null).getPropertyValue('border-left-width');
			const scrollWrapperHeight = containerRect.height;

			var top = selectRect.top + selectRect.height;
			if (top >= (containerRect.top + scrollWrapperHeight)) {
				top = containerRect.top + scrollWrapperHeight;
			}

			var maxHeight = window.innerHeight - top - 35;

			if (maxHeight > 400) {
				maxHeight = 400;
			}

			return {
				width: selectRect.width,
				top: top,
				left: selectRect.left - containerRect.left + parseInt(borderLeftWidth, 10),
				maxHeight: maxHeight
			}
		} else {
			return {};
		}
	}

	renderMenu(menu) {
		this.select = this.virtualizedSelect._selectRef;

		if (this.select) {
			this.control = this.select.control ? this.select.control : this.select.select.control;
		}
		
		var className = 'options-wrapper';
		if (this.props.className && this.props.className.indexOf('small') !== -1) {
			className += ' small';
		}

		if (this.menuContainer) {
			className += ' has-container';

			const style = this.getWrapperStyles();
			const menuWrapper = (
				<div 
					className={className}
					style={style}
					ref={wrapper => { this.wrapper = wrapper }}
					onMouseDown={this.handleMenuWrapperMouseDown}
				>
					{menu}
				</div>
			);

			return ReactDOM.createPortal(
		    menuWrapper,
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
				
				<VirtualizedSelect
					ref={virtualizedSelect => { this.virtualizedSelect = virtualizedSelect; }}
					value={this.props.value}
					onFocus={this.handleFocus}
					onOpen={this.handleOpen}
					onClose={this.handleClose}
					renderMenu={this.renderMenu}
					clearable={false}
					openOnFocus={true}
					maxHeight={400}
					{...props}
				/>
			</div>
		);
	}
}

export default Select;