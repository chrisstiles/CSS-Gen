import React from 'react';
import Sliders from '../../input/Sliders';
import AjaxSelect from '../../input/AjaxSelect';
import axios from 'axios';
import _ from 'underscore';
import { getGlobalVariable, setGlobalVariable } from '../../../util/helpers';

const sliders = [
  { title: 'Horizontal Shift', name: 'horizontalShift', min: -200, max: 200, appendString: 'px' },
  { title: 'Vertical Shift', name: 'verticalShift', min: -200, max: 200, appendString: 'px' },
  { title: 'Blur Radius', name: 'blurRadius', min: 0, max: 100, appendString: 'px' },
  { title: 'Shadow Opacity', name: 'shadowOpacity', min: 0, max: 100, appendString: '%' }
];

class TextShadowInputs extends React.Component {
	constructor(props) {
	  super(props);
	  
	  this.handleChange = this.handleChange.bind(this);
	  this.getFontOptions = this.getFontOptions.bind(this);
	}

	handleChange(value, name) {
		var state = {};
		state[name] = value;

	  this.props.updateGenerator(state);
	}

	setFontOptions() {
		this.allFontOptions = [];

		_.each(this.fontList, ({ family: font }) => {
			this.allFontOptions.push({
				value: font,
				label: font
			});
		});
	}

	getFontOptions(inputValue) {
		// No need to refetch data
		if (this.allFontOptions && _.isArray(this.allFontOptions)) {
			return { options: this.allFontOptions, complete: true };
		}

		const googleFontList = getGlobalVariable('googleFontList');

		// Save the fonts list to the global session state to prevent
		// having to hit the API every time the user navigates away
		if (googleFontList && _.isArray(googleFontList)) {
			// Fonts have already been loaded
			this.fontList = googleFontList;
			this.setFontOptions();
			
			return { options: this.allFontOptions, complete: true };
		} else {
			// Use Google API to get list of available fonts
			const apiUrl = [];
			apiUrl.push('https://www.googleapis.com/webfonts/v1/webfonts');
			apiUrl.push('?key=AIzaSyBAeBGJ5r_JdheXlg46qkgsiFemJ7zfuek');
			const url = apiUrl.join('');

			return axios.get(url).then(response => {
				this.fontList = response.data.items || [];
				this.setFontOptions();
				setGlobalVariable(this.fontList, 'googleFontList');
				return { options: this.allFontOptions, complete: true };
			});

		}
	}

	render() {
		return (
			<div>
				<AjaxSelect
				  label="Google Font"
				  placeholder="Search Google Fonts"
				  name="googleFont"
				  value={this.props.googleFont}
				  getOptions={this.getFontOptions}
				  onChange={this.handleChange}
				  menuContainer="#sidebar"
				  scrollWrapper="#sidebar-controls"
				  autoload={true}
				/>
				<Sliders
					sliders={sliders}
					onChange={this.handleChange}
					{...this.props}
				/>
			</div>
		);
	}
}

export default TextShadowInputs;