import React from 'react';
import AjaxSelect from '../../input/AjaxSelect';
import axios from 'axios';

// const GOOGLE_FONTS_API_KEY = 'AIzaSyBAeBGJ5r_JdheXlg46qkgsiFemJ7zfuek';

class TextShadowInputs extends React.Component {
	constructor(props) {
	  super(props);
	  
	  this.handleChange = this.handleChange.bind(this);
	  this.getGoogleFonts = this.getGoogleFonts.bind(this);
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
		
		axios.get(url).then(response => {
			console.log(response)
		});

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