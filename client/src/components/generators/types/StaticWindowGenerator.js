import React from 'react';
import Generator from '../../Generator';
import StaticWindowPreview from '../previews/StaticWindowPreview';
import Toolbar from '../toolbars/Toolbar';
import ColorPicker from '../../input/ColorPicker';
import { getState, getFullHeight } from '../../../util/helpers';
import _ from 'underscore';

class StaticWindowGenerator extends React.Component {
	constructor(props) {
		super(props);

		this.defaultState = _.extend({}, StaticWindowGenerator.defaultState, props.previewStyles);
		this.state = getState(this.defaultState, this.stateTypes, true);
		this.state.wrapperHeight = 400;
	}

	componentDidMount() {
		this.handleWindowResize();

		window.addEventListener('resize', this.handleWindowResize, false);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.handleWindowResize);
	}

	handleWindowResize = () => {
		this.setState({ wrapperHeight: getFullHeight() });
	}

	reset = () => {
		this.setState(this.defaultState);
		this.props.updateGenerator(this.props.generatorDefaultState);
	}

	renderPreview = () => {
		let preview, isDefault;
		const style = this.props.generatorState.css.styles;

		if (this.props.renderPreview) {
			preview = this.props.renderPreview(style);
			isDefault = false;
		} else {
			preview = <div className="preview" style={style} />;
			isDefault = true;
		}

		const { editorBackgroundColor: backgroundColor, wrapperHeight} = this.state;

		return (
			<StaticWindowPreview 
				backgroundColor={backgroundColor}
				wrapperHeight={wrapperHeight}
				isDefault={isDefault}
			>
				{preview}
			</StaticWindowPreview>
		);
	}

	handlePreviewUpdate = (value, name) => {
		const state = {};
		state[name] = value
	  this.setState(state);
	}

	renderToolbar = () => {
		const { editorBackgroundColor } = this.state;
		const { renderToolbarItems } = this.props;

		return (
			<Toolbar>
				<div className="toolbar-title">Preview<br /> Settings</div>

				{
					renderToolbarItems ? renderToolbarItems() : 
					
					<div className="item input">
						<ColorPicker
							label="Background"
							name="editorBackgroundColor"
							color={editorBackgroundColor}
							onChange={this.handlePreviewUpdate}
						/>
					</div>	
				}

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
		const props = _.extend({}, this.props, {
			renderPreview: this.renderPreview,
			renderToolbar: this.renderToolbar,
			previewState: this.state
		});

		return <Generator {...props} />;
	}
}

export default StaticWindowGenerator;

StaticWindowGenerator.defaultState = {
	showEditorBackgroundColor: false,
	editorBackgroundColor: 'transparent'
};

StaticWindowGenerator.stateTypes = {
	showEditorBackgroundColor: Boolean,
	editorBackgroundColor: String
};