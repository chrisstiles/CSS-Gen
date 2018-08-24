import React from 'react';
import Generator from '../../Generator';
import StaticWindowPreview from '../previews/StaticWindowPreview';
import Toolbar from '../toolbars/Toolbar';
import { getState } from '../../../util/helpers';
import _ from 'underscore';

class StaticWindowGenerator extends React.Component {
	constructor(props) {
		super(props);

		this.defaultState = {
			backgroundColor: 'transparent'
		};

		_.extend(this.defaultState, props.previewStyles);

		this.stateTypes = {
			backgroundColor: String
		};

		this.state = getState(this.defaultState, this.stateTypes, true);

		this.reset = this.reset.bind(this);
		this.renderPreview = this.renderPreview.bind(this);
		this.renderToolbar = this.renderToolbar.bind(this);
	}

	reset() {
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

		return (
			<StaticWindowPreview backgroundColor={this.state.backgroundColor}>
				{preview}
			</StaticWindowPreview>
		);
	}

	renderToolbar() {
		return (
			<Toolbar>
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