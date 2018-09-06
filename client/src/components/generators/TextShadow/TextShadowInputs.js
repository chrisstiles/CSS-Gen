import React from 'react';
import AjaxSelect from '../../input/AjaxSelect';
import axios from 'axios';
import Fuse from 'fuse-js-latest';
import _ from 'underscore';

class TextShadowInputs extends React.Component {
	constructor(props) {
	  super(props);

	  this.state = {
	  	fontOptions: [
	  		{ value: 'Montserrat', label: 'Montserrat' }
	  	]
	  };

	  this.allFontOptions = [];
	  
	  this.handleChange = this.handleChange.bind(this);
	  this.getGoogleFonts = this.getGoogleFonts.bind(this);
	}

	componentDidMount() {
		// Generate URL string
		// const apiUrl = [];
		// apiUrl.push('/api/google-fonts?query=');
		// apiUrl.push(inputValue.replace(/ /g, '+'));
		// const url = apiUrl.join('');

		// if (!this.fontList) {
			const apiUrl = [];
			apiUrl.push('https://www.googleapis.com/webfonts/v1/webfonts');
			apiUrl.push('?key=AIzaSyBAeBGJ5r_JdheXlg46qkgsiFemJ7zfuek');
			const url = apiUrl.join('');

			axios.get(url).then(response => {
				// Format font 
				this.fontList = response.data.items;
				_.each(this.fontList, ({ family: font }) => {
					this.allFontOptions.push({
						value: font,
						label: font
					});
				});
				console.log(this.allFontOptions)
			});
		// }
	}

	handleChange(value, name) {
		var state = {};
		state[name] = value;

		// console.log(state)
	  console.log(state)
	  this.props.updateGenerator(state);
	  // this.getGoogleFonts(value);
	}

	getGoogleFonts(inputValue) {
		inputValue = inputValue || this.props.googleFont;
		// // Generate URL string
		// const apiUrl = [];
		// apiUrl.push('/api/google-fonts?query=');
		// apiUrl.push(inputValue.replace(/ /g, '+'));
		// const url = apiUrl.join('');

		// if (!this.fontList) {
		// 	const apiUrl = [];
		// 	apiUrl.push('https://www.googleapis.com/webfonts/v1/webfonts');
		// 	apiUrl.push('?key=AIzaSyBAeBGJ5r_JdheXlg46qkgsiFemJ7zfuek');
		// 	const url = apiUrl.join('');

		// 	axios.get(url).then(response => {
		// 		// Format font 
		// 		this.fontList = response.data.items;
		// 		_.each(this.fontList, ({ family: font }) => {
		// 			this.fontOptions.push({
		// 				value: font,
		// 				label: font
		// 			});
		// 		});

		// 	});
		// }

		if (!inputValue) {
			return this.allFontOptions;
		}

		const fuse = new Fuse(this.allFontOptions, {
			shouldSort: false,
			keys: ['label']
		});

		const fontOptions = fuse.search(inputValue);
		
		return fontOptions;

		// this.setState({ fontOptions });
		// this.fontOptions = fuse.search(inputValue);
	}

	render() {
		// console.log(this.state.fontOptions, this.props.googleFont)
		return (
			<AjaxSelect
			  label="Google Font"
			  placeholder="Search Google Fonts"
			  name="googleFont"
			  value={this.props.googleFont}
			  getOptions={this.getGoogleFonts}
			  onChange={this.handleChange}
			  menuContainer="#sidebar"
			  scrollWrapper="#sidebar-controls"
			/>
		);
	}
}

export default TextShadowInputs;