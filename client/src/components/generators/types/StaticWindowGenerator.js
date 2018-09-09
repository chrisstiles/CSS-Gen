import React from 'react';
import Generator from '../../Generator';
import StaticWindowPreview from '../previews/StaticWindowPreview';
import Toolbar from '../toolbars/Toolbar';
import ColorPicker from '../../input/ColorPicker';
import Toggle from '../../input/Toggle';
import { getState } from '../../../util/helpers';
import _ from 'underscore';

class StaticWindowGenerator extends React.Component {
	constructor(props) {
		super(props);

		this.defaultState = {
			showEditorBackgroundColor: false,
			editorBackgroundColor: '#fff'
		};

		_.extend(this.defaultState, props.previewStyles);

		this.stateTypes = {
			showEditorBackgroundColor: Boolean,
			editorBackgroundColor: String
		};

		this.state = getState(this.defaultState, this.stateTypes, true);

		this.reset = this.reset.bind(this);
		this.handlePreviewUpdate = this.handlePreviewUpdate.bind(this);
		this.renderPreview = this.renderPreview.bind(this);
		this.renderToolbar = this.renderToolbar.bind(this);
	}

	reset() {
		this.setState(this.defaultState);
		this.props.updateGenerator(this.props.generatorDefaultState);
	}

	renderPreview() {
		var preview, isDefault;
		const style = this.props.generatorState.css.styles;

		if (this.props.renderPreview) {
			preview = this.props.renderPreview(style);
			isDefault = false;
		} else {
			preview = <div className="preview" style={style} />;
			isDefault = true;
		}

		const { showEditorBackgroundColor, editorBackgroundColor } = this.state;
		const backgroundColor = showEditorBackgroundColor ? editorBackgroundColor : 'transparent';

		return (
			<StaticWindowPreview 
				backgroundColor={backgroundColor}
				isDefault={isDefault}
			>
				{preview}
			</StaticWindowPreview>
		);
	}

	handlePreviewUpdate(value, name) {
		const state = {};
		state[name] = value
	  this.setState(state);
	}

	renderToolbar() {
		const { showEditorBackgroundColor, editorBackgroundColor } = this.state;

		return (
			<Toolbar>
				<div className="toolbar-title">Preview<br /> Settings</div>

				<div className="item input">
				  <Toggle
				    name="showEditorBackgroundColor"
				    onChange={this.handlePreviewUpdate}
				    label="Background Color:"
				    className="left"
				    checked={showEditorBackgroundColor}
				  >
		  		  {showEditorBackgroundColor ? 
		  	  	  <ColorPicker
		  	  	    name="editorBackgroundColor"
		  	  	    color={editorBackgroundColor}
		  	  	    onChange={this.handlePreviewUpdate}
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
				previewState={this.state}
				{...props}
			/>
		);
	}
}

export default StaticWindowGenerator;