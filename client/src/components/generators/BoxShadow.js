import React from 'react';
import Generator from '../Generator';
import Sliders from '../input/Sliders';
import Toolbar from './toolbars/Toolbar';
import PreviewWindow from '../PreviewWindow';
import _ from 'underscore';

const sliders = [
  { title: 'Horizontal Shift', name: 'horizontalShift', min: -200, max: 200 },
  { title: 'Vertical Shift', name: 'verticalShift', min: -200, max: 200 },
  { title: 'Blur Radius', name: 'blurRadius', min: 0, max: 100 },
  { title: 'Spread Radius', name: 'spreadRadius', min: 0, max: 100 },
  { title: 'Shadow Opacity', name: 'shadowOpacity', min: 0, max: 1, step: .01 }
];

class BoxShadow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      horizontalShift: 0,
      verticalShift: 8,
      shadowColor: '#000',
      blurRadius: 28,
      spreadRadius: 0,
      shadowOpacity: 0.25,
      style: ''
    };

    this.initialState = this.state;

    this.generateCSS = this.generateCSS.bind(this);
    this.reset = this.reset.bind(this);
    this.renderInputs = this.renderInputs.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    const css = this.generateCSS();

    this.setState({ style: css });
    this.initialState.style = css;
  }

  generateCSS(styles) {
    styles = styles || {};
    const rules = _.extend({}, this.state, styles);
    const css = `${rules.horizontalShift}px ${rules.verticalShift}px ${rules.blurRadius}px ${rules.spreadRadius}px rgba(0, 0, 0, ${rules.shadowOpacity})`;
    
    return css;
  }

  reset() {
    this.previewWindow.resetWindow(); 
    this.setState(this.initialState);
  }

  handleChange(cssRule, value) {
    var newState = {};
    newState[cssRule] = value;
    newState.style = this.generateCSS(newState);

    this.setState(newState);
  }

  renderInputs() {
    return (
      <Sliders
        sliders={sliders}
        handleChange={this.handleChange}
        {...this.state}
      />
    );
  }

  renderToolbar() {
    return (
      <Toolbar
        ref={toolbar => { this.toolbar = toolbar }}
      >
        <button
          className="button"
          onClick={() => { this.reset(); }}
        >
          Reset Window
        </button>
      </Toolbar>
    );
  }

  renderPreviewWindow() {
    return (
      <PreviewWindow
        ref={previewWindow => { this.previewWindow = previewWindow }}
        style={{ boxShadow: this.state.style }}
        size={{ width: 400, height: 400 }}
      />
    );
  }

  render() {
    // const Toolbar = <Toolbar />;

    // const Perv

    return (
      <Generator 
        title="CSS Box Shadow Generator | CSS-GEN"
        property="box-shadow"
        heading="CSS Box Shadow Generator"
        toolbar={this.renderToolbar()}
        previewWindow={this.renderPreviewWindow()}
        generateCSS={this.generateCSS}
        renderInputs={this.renderInputs}
      />
    );
  }
}

export default BoxShadow;