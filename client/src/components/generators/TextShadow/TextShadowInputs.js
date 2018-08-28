import React from 'react';
import AjaxSelect from '../../input/AjaxSelect';
import axios from 'axios';

// const GOOGLE_FONTS_API_KEY = 'AIzaSyBAeBGJ5r_JdheXlg46qkgsiFemJ7zfuek';

class TextShadowInputs extends React.Component {
	constructor(props) {
	  super(props);
	  
	  this.handleChange = this.handleChange.bind(this);
	  this.getGoogleFonts = this.getGoogleFonts.bind(this);

	  axios.get('/api/google-fonts').then(response => {
	  	// this.fontsList = response;
	  	console.log(response)
	  });	
	}

	handleChange(value, name) {
		var state = {};
		state[name] = value;
	  
	  this.props.updateGenerator(state);
	}

	getGoogleFonts(inputValue) {
		// Generate URL string
		const apiUrl = [];
		apiUrl.push('/api/google-fonts?query=');
		apiUrl.push(inputValue.replace(/ /g, '+'));
		// apiUrl.push(`&key=${GOOGLE_FONTS_API_KEY}`);
		const url = apiUrl.join('');

		if (!this.fontsList) {
			const apiUrl = [];
			apiUrl.push('https://www.googleapis.com/webfonts/v1/webfonts');
			apiUrl.push('?key=AIzaSyBAeBGJ5r_JdheXlg46qkgsiFemJ7zfuek');
			const url = apiUrl.join('');

			axios.get(url).then(response => {
				this.fontsList = response;
			});
		} else {
			console.log(this.fontsList)
			return this.fontsList;
		}

		// axios.get('/api/google-fonts', {
		// 	method: 'HEAD',
		// 	mode: 'no-cors'
		// }).then(response => {
		// 	// this.fontsList = response;
		// 	console.log(response)
		// });	

		// console.log(this.fontsList)

		// console.log(this.fontsList)
		// console.log(results)
		// return results;
	}

	render() {
		return (
			<AjaxSelect
			  value={this.props.type}
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