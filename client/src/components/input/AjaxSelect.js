import React from 'react';
import Select from './Select';
import _ from 'underscore';

class AjaxSelect extends React.Component {
	constructor(props) {
		super(props);

		this.loadOptions = _.debounce(this._loadOptions.bind(this), 50);
	}

	_loadOptions(inputValue) {
		console.log(inputValue)
		this.props.getOptions(inputValue);
	}

	render() {
		return (
			<Select
				onInputChange={this.loadOptions}
				{...this.props}
			/>
		)
	}
}

export default AjaxSelect;