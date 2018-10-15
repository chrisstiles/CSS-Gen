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
		const { scrollWrapper = '#sidebar-controls', menuContainer = '#sidebar' } = this.props;

		this.menuContainer = document.querySelector(menuContainer);

		if (this.menuContainer) {
			this.scrollWrapper = scrollWrapper ? document.querySelector(scrollWrapper) : this.menuContainer;

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
		this.isOpen = true;
		// setTimeout(()=> {debugger}, 300)
		if (this.props.onOpen) {
			this.props.onOpen();
		}
	}

	handleClose() {
		this.isOpen = false;

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
		
		const className = ['options-wrapper'];

		if (this.props.className && this.props.className.indexOf('small') !== -1) {
			className.push('small');
		}

		if (this.menuContainer) {
			className.push('has-container');

			const style = this.getWrapperStyles();
			const menuWrapper = (
				<div 
					className={className.join(' ')}
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
		var optionHeight = 31;

		if (this.props.className) {
			className += ` ${this.props.className}`;
			optionHeight = 28;
		}

		const props = _.extend({}, this.props, { onChange: this.handleChange, className: '' });

		if (props.searchable === undefined) {
			props.searchable = false;
		}

		return(
			<div className={className}>
				{this.props.label ? <label className="title">{this.props.label}</label> : null}
				
				<VirtualizedSelect
					ref={virtualizedSelect => { this.virtualizedSelect = virtualizedSelect; }}
					value={this.props.value}
					renderMenu={this.renderMenu}
					clearable={false}
					openOnFocus={true}
					maxHeight={400}
					optionHeight={optionHeight}
					onFocus={this.handleFocus}
					onOpen={this.handleOpen}
					onClose={this.handleClose}
					{...props}
				/>
			</div>
		);
	}
}

export default Select;