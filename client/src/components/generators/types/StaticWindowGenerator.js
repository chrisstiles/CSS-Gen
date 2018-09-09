import React from 'react';
import Generator from '../../Generator';
import StaticWindowPreview from '../previews/StaticWindowPreview';
import Toolbar from '../toolbars/Toolbar';
import ColorPicker from '../../input/ColorPicker';
import Toggle from '../../input/Toggle';
import { getGlobalDefaults, updateGlobalState } from '../../../util/helpers';

class StaticWindowGenerator extends React.Component {
	constructor(props) {
		super(props);

		this.reset = this.reset.bind(this);
		this.renderPreview = this.renderPreview.bind(this);
		this.renderToolbar = this.renderToolbar.bind(this);
	}

	reset() {
		// Revert global defaults
		const { showEditorBackgroundColor, editorBackgroundColor } = getGlobalDefaults();
		updateGlobalState({ showEditorBackgroundColor, editorBackgroundColor });
		
		this.setState(this.defaultState);
		this.props.updateGenerator(this.props.generatorDefaultState);
	}

	renderPreview() {
		var preview;

		if (this.props.renderPreview) {
			preview = this.props.renderPreview();
		} else {
			const styles = this.props.generatorState.css.styles;
			preview = <div className="preview" style={styles} />
		}

		const { showEditorBackgroundColor, editorBackgroundColor } = this.props.globalState;
		const backgroundColor = showEditorBackgroundColor ? editorBackgroundColor : 'transparent';

		return (
			<StaticWindowPreview backgroundColor={backgroundColor}>
				{preview}
			</StaticWindowPreview>
		);
	}

	renderToolbar() {
		const { showEditorBackgroundColor, editorBackgroundColor } = this.props.globalState;

		return (
			<Toolbar>
				<div className="toolbar-title">Preview<br /> Settings</div>

				<div className="item input">
				  <Toggle
				    name="showEditorBackgroundColor"
				    onChange={updateGlobalState}
				    label="Background Color:"
				    className="left"
				    checked={showEditorBackgroundColor}
				  >
		  		  {showEditorBackgroundColor ? 
		  	  	  <ColorPicker
		  	  	    name="editorBackgroundColor"
		  	  	    color={editorBackgroundColor}
		  	  	    onChange={updateGlobalState}
		  	  	  />
		  		  : null}
				  </Toggle>
				</div>

				

				<div className="right">
				  <button
				    className="button"
				    onClick={this.reset}
				  >
				    Reset
				  </button>
				</div>
			</Toolbar>
		);
	}

	render() {
		const { generatorState, renderInputs, renderPresets, title, heading, intro, className, hasBrowserPrefixes } = this.props;
		const props = { generatorState, renderInputs, renderPresets, title, heading, intro, className, hasBrowserPrefixes };

		return (
			<Generator
				renderPreview={this.renderPreview}
				renderToolbar={this.renderToolbar}
				outputPreviewStyles={this.props.globalState.outputPreviewStyles}
				showBrowserPrefixes={this.props.globalState.showBrowserPrefixes}
				{...props}
			/>
		);
	}
}

export default StaticWindowGenerator;