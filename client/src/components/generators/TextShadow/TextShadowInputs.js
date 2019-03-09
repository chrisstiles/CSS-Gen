import React from 'react';
import Sidebar from '../../Sidebar';
import Sliders from '../../input/Sliders';
import Select from '../../input/Select';
import AjaxSelect from '../../input/AjaxSelect';
import ColorPicker from '../../input/ColorPicker';
import Toggle from '../../input/Toggle';
import _ from 'underscore';
import tinycolor from 'tinycolor2';
import WebFont from 'webfontloader';
import { 
	getGlobalVariable, 
	setGlobalVariable, 
	hexOrRgba, 
	startLoading, 
	finishLoading,
	addNotification,
	getNotificationTypes
} from '../../../util/helpers';

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

		// Queue a font to load in case loadFont is
		// called before the list is downloaded
		this.queuedFont = null;
	}

	componentDidMount() {
		this.loadFont(this.props.googleFont, true, 'page');
	}

	handleChange = (value, name) => {
		var state = {};
		state[name] = value;

		// Keep color and shadow opacity in sync
		if (name === 'shadowColor') {
			const alpha = tinycolor(value).getAlpha() * 100;
			state.shadowOpacity = parseInt(alpha, 10);
		} else if (name === 'shadowOpacity') {
			const color = this.props.shadowColor;
			state.shadowColor = hexOrRgba(tinycolor(color).setAlpha(value / 100));
		}

	  this.props.updateGenerator(state);
	}

	handleFontVariantChange = (value, name) => {
		var { variant } = this.props;
		variant = variant.toLowerCase();
		if (name === 'italic') {
			if (variant === 'regular' && value) {
				variant = 'italic'
			} else {
				variant = variant.replace('italic', '');
				if (value) {
					variant += 'italic';
				} else {
					if (variant === '') {
						variant = 'regular';
					}
				}
			}
		} else {
			if (variant.indexOf('italic') === -1) {
				variant = value;
			} else {
				if (value === 'regular') {
					variant = 'italic';
				} else {
					variant = `${value}italic`;
				}
			}
		}

		this.props.updateGenerator({ variant });
	}

	// loadFont(font = this.props.googleFont, variantOptions = this.props.variantOptions, forceLoad) {
	loadFont = (font, forceLoad, loadingKey = 'preview') => {
		startLoading(loadingKey);

		if (forceLoad || this.fontList[font]) {
			const list = this.fontList;
			const variantOptions = list && list[font].variantOptions ? list[font].variantOptions : this.props.variantOptions;

			const variants = variantOptions.map(variant => {
				return variant.replace(/bolditalic/g, 'bi').replace(/italic/g, 'i')
			});

			const query = `${font.replace(/ /g, '+')}:${variants.join(',')}`;
			
			try {
				WebFont.load({
					google: {
						families: [query]
					},
					fontactive: googleFont => {
						this.handleFontLoaded(googleFont, loadingKey);
					},
					fontinactive: () => {
						this.handleFontError(loadingKey)
					},
					classes: false
				});
			} catch(error) {
				finishLoading(loadingKey);
				console.log('Font load error');
			}
			
		} else {
			this.queuedFont = font;
		}
	}

	handleFontSelect = googleFont => {
		if (this.fontList) {
			this.loadFont(googleFont)
		} else {
			this.queuedFont = googleFont;
		}
	}

	handleFontLoaded = (googleFont, loadingKey = 'preview') => {
		if (this.fontList) {
			const { fontFamily, variantOptions } = this.fontList[googleFont];
			let variant = variantOptions[0];

			if (variantOptions.includes('regular')) {
				variant = 'regular';
			} else {
				['400', '300', '500', 'normal'].forEach(option => {
					if (variantOptions.includes(option)) {
						variant = option;
						return;
					}
				});
			}

			this.props.updateGenerator({ googleFont, fontFamily, variantOptions, variant });
		}

		finishLoading(loadingKey);
	}

	handleFontError = (loadingKey = 'preview') => {
		const error = 'Font could not be loaded';
		addNotification(getNotificationTypes().error, error);
		finishLoading(loadingKey);
	}

	setFontOptions = fontData => {
		this.allFontOptions = [];

		if (_.isArray(fontData)) {
			// Data from API passed in
			this.fontList = {};
			
			// Loop through API data to format object with fonts
			// and array with select options
			_.each(fontData, ({ family: font, variants, category, ...restprops }) => {
				this.allFontOptions.push({
					value: font,
					label: font
				});

				this.fontList[font] = {
					fontFamily: `"${font}", ${category}`,
					variantOptions: variants
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
		}

		if (this.queuedFont) {
			this.loadFont(this.queuedFont)
			this.queuedFont = null;
		}
	}

	getFontOptions = inputValue => {
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

			return fetch(url)
				.then(response => response.json())
				.then(data => {
					const fontData = data.items || [];
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

		const { googleFont, variantOptions, variant } = this.props;
		const weights = [];
		let hasItalicVariant = false;
		let italicActive = false;
		let weightValue = variant.replace('italic', '');

		if (variantOptions) {
			_.each(variantOptions, element => {

				if (element.toLowerCase().indexOf('italic') === -1) {
					weights.push({
						value: element,
						label: element.charAt(0).toUpperCase() + element.slice(1)
					});
				} else {
					hasItalicVariant = true;
				}
			});

			if (variant.toLowerCase().indexOf('italic') !== -1) {
				italicActive = true;

				if (variant === 'italic') {
					weightValue = 'regular';
				}
			}
		}

		return (
			<Sidebar>
				<div className="section-title">Text Shadow Settings</div>
				<Sliders
					sliders={_shadowSlideres}
					onChange={this.handleChange}
					{...this.props}
				/>
				<div className="divider" />
				<div className="section-title">Font Settings</div>
				<Sliders
					sliders={_fontSliders}
					onChange={this.handleChange}
					{...this.props}
				/>
				<div id="google-font-settings">
					<AjaxSelect
						label="Google Font"
						placeholder="Search Google Fonts"
						name="googleFont"
						value={googleFont}
						getOptions={this.getFontOptions}
						onChange={this.handleFontSelect}
						autoload={true}
						autoBlur={true}
					/>
					{variantOptions ?
						<div className="inputs-row">
							<Select
								label="Font Weight"
								name="variant"
								value={weightValue}
								onChange={this.handleFontVariantChange}
								options={weights}
								searchable={false}
								className="w77"
							/>
							<div className="field-wrapper right">
								<Toggle
									onChange={this.handleFontVariantChange}
									checked={italicActive}
									disabled={!hasItalicVariant}
									label="Italic"
									name="italic"
								/>
							</div>
						</div>
						: null}
				</div>
			</Sidebar>
		);
	}
}

export default TextShadowInputs;