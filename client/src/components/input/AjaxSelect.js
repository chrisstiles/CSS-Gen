import React from 'react';
import Select from './Select';
import _ from 'underscore';

class AjaxSelect extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			options: []
		};

		const { debounceTime = 150 } = props;

		this.loadOptions = _.debounce(this._loadOptions.bind(this), debounceTime);
		this.handleFocus = this.handleFocus.bind(this);
	}

	_loadOptions(inputValue) {
		// console.log(inputValue)
		const options = this.props.getOptions(inputValue);
		this.setState({ options });
	}

	handleFocus() {
		this.loadOptions();
	}

	// handleBlur() {

	// }

	render() {
		return (
			<Select
				onInputChange={this.loadOptions}
				options={this.state.options}
				{...this.props}
			/>
		)
	}
}

export default AjaxSelect;