import React from 'react';
import ReactDOM from 'react-dom';
import ReactSelect from 'react-select';
import 'react-select/dist/react-select.css';
import defaultMenuRenderer from 'react-select/lib/utils/defaultMenuRenderer';
import _ from 'underscore';

class Select extends React.Component {
	constructor(props) {
		super(props);

		this.handleChange = this.handleChange.bind(this);
		this.handleOpen = this.handleOpen.bind(this);
		this.getWrapperStyles = this.getWrapperStyles.bind(this);
		this.scrollMenu = this.scrollMenu.bind(this);
		this.renderMenu = this.renderMenu.bind(this);
	}

	componentDidMount() {
		this.menuContainer = document.querySelector(this.props.menuContainer);
		
		if (this.menuContainer) {
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

		if (event.target === this.menuContainer || this.menuContainer.contains(event.target)) {
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

	getWrapperStyles(scrollWrapper) {
		const selectRect = this.select.control.getBoundingClientRect();
		const containerRect = this.menuContainer.getBoundingClientRect();
		const borderLeftWidth = getComputedStyle(this.menuContainer, null).getPropertyValue('border-left-width');
		const scrollWrapperHeight = scrollWrapper ? scrollWrapper.getBoundingClientRect().height : containerRect.height;

		var top = selectRect.top + selectRect.height;
		if (top >= (containerRect.top + scrollWrapperHeight)) {
			top = containerRect.top + scrollWrapperHeight.height;
		}

		var maxHeight = window.innerHeight - top - 25;

		if (maxHeight > 350) {
			maxHeight = 350;
		}

		const style = {
			width: selectRect.width,
			top: top - containerRect.top,
			left: selectRect.left - containerRect.left - parseInt(borderLeftWidth, 10),
			maxHeight: maxHeight
		}

		return style;
	}

	renderMenu(params) {
		const options = defaultMenuRenderer(params);

		if (this.menuContainer) {
			const style = this.getWrapperStyles();

			const menu = (
				<div 
					className="menu-wrapper has-container"
					style={style}
					ref={wrapper => { this.wrapper = wrapper }}
				>
					{options}
				</div>
			);

			return ReactDOM.createPortal(
		    menu,
		    this.menuContainer
		  );
		} else {
			const menu = (
				<div className="menu-wrapper">
					{options}
				</div>
			);

			return menu;
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
				<label className="title">{this.props.label}</label>
				<ReactSelect
					ref={select => { this.select = select }}
					onOpen={this.handleOpen}
					menuRenderer={this.renderMenu}
					clearable={false}
					{...props}
				/>
			</div>
		);
	}
}

export default Select;