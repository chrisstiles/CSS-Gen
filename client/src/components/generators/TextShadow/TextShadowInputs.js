import React from 'react';
import Sliders from '../../input/Sliders';
import AjaxSelect from '../../input/AjaxSelect';
import ColorPicker from '../../input/ColorPicker';
import { getGlobalVariable, setGlobalVariable } from '../../../util/helpers';
import axios from 'axios';
import _ from 'underscore';
import WebFont from 'webfontloader';

const shadowSliders = [
	{ title: 'Blur Radius', name: 'blurRadius', min: 0, max: 100, appendString: 'px', className: 'small' },
  { title: 'Shift X', name: 'horizontalShift', min: -200, max: 200, appendString: 'px', className: 'half' },
  { title: 'Shift Y', name: 'verticalShift', min: -200, max: 200, appendString: 'px', className: 'half no-margin' },
	{ title: 'Shadow Opacity', name: 'shadowOpacity', min: 0, max: 100, appendString: '%', className: 'w70 small no-margin left' }
];

const fontSliders = [
	{ title: 'Font Size', name: 'fontSize', min: 1, max: 200, appendString: 'px', className: 'w70 no-margin left' }
];

class TextShadowInputs extends React.Component {
	constructor(props) {
	  super(props);
	  
	  this.loadFont = this.loadFont.bind(this);
	  this.handleChange = this.handleChange.bind(this);
	  this.handleFontSelect = this.handleFontSelect.bind(this);
	  this.handleFontLoaded = this.handleFontLoaded.bind(this);
	  this.getFontOptions = this.getFontOptions.bind(this);
	}

	// componentDidMount() {
	// 	this.loadFont();
	// }

	handleChange(value, name) {
		var state = {};
		state[name] = value;

	  this.props.updateGenerator(state);
	}

	loadFont(googleFont = this.props.googleFont) {
		if (googleFont !== 'Montserrat') {
			if (this.fontList[googleFont]) {
				WebFont.load({
					google: {
						families: [googleFont]
					},
					fontactive: this.handleFontLoaded,
					classes: false
				});
			}
		} else {
			this.handleFontLoaded(googleFont);
		}
	}

	handleFontSelect(googleFont) {
		// Montserrat is the default application font
		// and therefor does not need to be loaded
		this.loadFont(googleFont);
		this.props.updateGenerator({ googleFont });
	}

	handleFontLoaded(googleFont) {
		const { fontFamily } = this.fontList[googleFont];
		this.props.updateGenerator({ fontFamily });
		// this.props.updateGenerator({ fontFamily, previewContentLoaded: true });
	}

	setFontOptions(fontData) {
		this.allFontOptions = [];

		if (_.isArray(fontData)) {
			// Data from API passed in
			this.fontList = {};
			
			// Loop through API data to format object with fonts
			// and array with select options
			_.each(fontData, ({ family: font, variants, category }) => {
				this.allFontOptions.push({
					value: font,
					label: font
				});

				this.fontList[font] = {
					fontFamily: `"${font}", ${category}`,
					variants
				};
			});
		} else if (_.isObject(fontData)) {
			// Fonts already formatted into object
			this.fontList = fontData;

			// Save options for drop down
			_.each(fontData, (value, font) => {
				this.allFontOptions.push({
					value: font,
					label: font
				});
			});
		} else {
			return;
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
			this.setFontOptions(googleFontList);
			
			return { options: this.allFontOptions, complete: true };
		} else {
			// Use Google API to get list of available fonts
			const apiUrl = [];
			apiUrl.push('https://www.googleapis.com/webfonts/v1/webfonts');
			apiUrl.push('?key=AIzaSyBAeBGJ5r_JdheXlg46qkgsiFemJ7zfuek');
			const url = apiUrl.join('');

			return axios.get(url).then(response => {
				const fontData = response.data.items || [];
				this.setFontOptions(fontData);
				setGlobalVariable(this.fontList, 'googleFontList');
				return { options: this.allFontOptions, complete: true };
			});

		}
	}

	render() {
		const _shadowSlideres = shadowSliders.slice();
		_shadowSlideres.push(
			<ColorPicker
				className="small no-margin align-right small-preview"
				name="shadowColor"
				key="ShadowColor"
				color={this.props.shadowColor}
				onChange={this.handleChange}
			/>
		);

		// Add font color to slider
		const _fontSliders = fontSliders.slice();
		_fontSliders.push(
			<ColorPicker
			  color={this.props.fontColor}
			  onChange={this.handleChange}
			  name="fontColor"
			  key="fontColor"
			  className="small no-margin align-right small-preview"
			/>
		);

		return (
			<div>
				<div className="section-title">Text Shadow Settings</div>
				<Sliders
					sliders={_shadowSlideres}
					onChange={this.handleChange}
					{...this.props}
				/>
				<div className="divider" />
				<div className="section-title">Font Settings</div>
				<AjaxSelect
				  label="Google Font"
				  placeholder="Search Google Fonts"
				  name="googleFont"
				  value={this.props.googleFont}
				  getOptions={this.getFontOptions}
				  onChange={this.handleFontSelect}
				  menuContainer="#sidebar"
				  scrollWrapper="#sidebar-controls"
				  autoload={true}
				/>
				<Sliders
					sliders={_fontSliders}
					onChange={this.handleChange}
					{...this.props}
				/>
			</div>
		);
	}
}

export default TextShadowInputs;