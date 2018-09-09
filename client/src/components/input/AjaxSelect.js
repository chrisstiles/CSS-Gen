import React from 'react';
import Select from './Select';
import _ from 'underscore';

class AjaxSelect extends React.Component {
	constructor(props) {
		super(props);

		const { value } = props;

		this.state = {
			options: [
				{ value: value, label: value }
			]
		};

		this.debounceTime = props.debounceTime === undefined ? 850 : props.debounceTime;
		this.getOptions = this._getOptions.bind(this)
	}

	_getOptions(inputValue) {
		const options = this.props.getOptions(inputValue);

		if (_.isObject(options)) {
			return Promise.resolve(options);
		} else {
			return options;
		}

		if (!this.debounceAdded) {
			this.getOptions = _.debounce(this._getOptions.bind(this), this.debounceTime);
			this.debounceAdded = true;
		}
	}

	render() {
		const { autoload } = this.props;

		return (
			<Select
				async={true}
				loadOptions={this.getOptions}
				autoload={autoload}
				{...this.props}
			/>
		)
	}
}

export default AjaxSelect;