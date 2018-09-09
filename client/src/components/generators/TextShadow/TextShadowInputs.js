import React from 'react';
import AjaxSelect from '../../input/AjaxSelect';
import axios from 'axios';
import Fuse from 'fuse-js-latest';
import _ from 'underscore';
import { getGlobalVariable, setGlobalVariable } from '../../../util/helpers';

class TextShadowInputs extends React.Component {
	constructor(props) {
	  super(props);

	  const { googleFont } = props;

	  this.state = {};
	  
	  this.handleChange = this.handleChange.bind(this);
	  this.handleTextCange = this.handleTextCange.bind(this);
	  this.getGoogleFonts = this.getGoogleFonts.bind(this);
	  this.filterFontOptions = this.filterFontOptions.bind(this);
	  this.getFontOptions = this.getFontOptions.bind(this);
	}

	handleChange(value, name) {
		var state = {};
		state[name] = value;

	  this.props.updateGenerator(state);
	}

	handleTextCange(event) {
		this.props.updateGenerator({ 'text': event.target.value });
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

	getGoogleFonts(updateOptions) {
		const googleFontList = getGlobalVariable('googleFontList');

		// Save the fonts list to the global session state to prevent
		// having to hit the API every time the user navigates away
		if (googleFontList) {
			// Fonts have already been loaded
			this.fontList = googleFontList;
			this.setFontOptions();
			updateOptions();
		} else {
			// Use Google API to get list of available fonts
			const apiUrl = [];
			apiUrl.push('https://www.googleapis.com/webfonts/v1/webfonts');
			apiUrl.push('?key=AIzaSyBAeBGJ5r_JdheXlg46qkgsiFemJ7zfuek');
			const url = apiUrl.join('');

			axios.get(url).then(response => {
				this.fontList = response.data.items || [];
				this.setFontOptions();
				updateOptions();
				setGlobalVariable(this.fontList, 'googleFontList');
			});

		}
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

	filterFontOptions(inputValue = this.props.googleFont) {		
		if (!inputValue) {
			return this.allFontOptions;
		}

		const fuse = new Fuse(this.allFontOptions, {
			shouldSort: false,
			keys: ['label']
		});

		return fuse.search(inputValue);
	}

	render() {
		const { text, googleFont } = this.props;
		return (
			<div>
				<div className="field-wrapper">
					<label className="title">Text</label>
					<textarea 
						onChange={this.handleTextCange}
						name="text"
						value={text}
					/>
				</div>
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
			</div>
		);
	}
}

export default TextShadowInputs;