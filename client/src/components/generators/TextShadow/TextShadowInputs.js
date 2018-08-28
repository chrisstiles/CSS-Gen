import React from 'react';
import AjaxSelect from '../../input/AjaxSelect';
import axios from 'axios';
import _ from 'underscore';

// const GOOGLE_FONTS_API_KEY = 'AIzaSyBAeBGJ5r_JdheXlg46qkgsiFemJ7zfuek';

class TextShadowInputs extends React.Component {
	constructor(props) {
	  super(props);

	  this.fontOptions = [];
	  
	  this.handleChange = this.handleChange.bind(this);
	  this.getGoogleFonts = _.debounce(this._getGoogleFonts.bind(this), 200);

	  // axios.get('/api/google-fonts').then(response => {
	  // 	// this.fontsList = response;
	  // 	console.log(response)
	  // });	
	}

	handleChange(value, name) {
		var state = {};
		state[name] = value;
	  
	  this.props.updateGenerator(state);
	}

	_getGoogleFonts(inputValue) {
		// Generate URL string
		const apiUrl = [];
		apiUrl.push('/api/google-fonts?query=');
		apiUrl.push(inputValue.replace(/ /g, '+'));
		// apiUrl.push(`&key=${GOOGLE_FONTS_API_KEY}`);
		const url = apiUrl.join('');

		if (!this.fontList) {
			const apiUrl = [];
			apiUrl.push('https://www.googleapis.com/webfonts/v1/webfonts');
			apiUrl.push('?key=AIzaSyBAeBGJ5r_JdheXlg46qkgsiFemJ7zfuek');
			const url = apiUrl.join('');

			axios.get(url).then(response => {
				// Format font 
				this.fontList = response.data.items;
				_.each(this.fontList, ({ family: font }) => {
					this.fontOptions.push({
						value: font,
						label: font
					});
				});

			});
		}

		return { options: this.fontOptions };
	}

	render() {
		return (
			<AjaxSelect
			  inputValue={this.props.type}
			  label="Google Font"
			  placeholder="Search Google Fonts"
			  getOptions={this.getGoogleFonts}
			  onChange={this.handleChange}
			  menuContainer="#sidebar"
			  scrollWrapper="#sidebar-controls"
			/>
		);
	}
}

export default TextShadowInputs;