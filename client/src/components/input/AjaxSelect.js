import React from 'react';
import Select from './Select';

class AjaxSelect extends React.Component {
	constructor(props) {
		super(props);

		this.loadOptions = this.loadOptions.bind(this);
	}

	loadOptions(inputValue) {
		return new Promise(resolve => {
			resolve(this.props.getOptions(inputValue));
		});
	}

	render() {
		return (
			<Select
				async={true}
				autoload={false}
				loadOptions={this.loadOptions}
				{...this.props}
			/>
		)
	}
}

export default AjaxSelect;