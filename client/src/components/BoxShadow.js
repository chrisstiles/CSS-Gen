import React from 'react';
import Generator from './Generator';
import Sidebar from './Sidebar';
import Slider from './input/Slider';
import CodeOutput from './CodeOutput';
import _ from 'underscore';
// import 'rc-slider/assets/index.css';

class BoxShadow extends React.Component {
  constructor(props) {
    super(props);
    document.title = 'CSS Box Shadow Generator | CSS-GEN';

    this.state = {
      horizontalShift: 0,
      verticalShift: 0,
      shadowColor: '#000',
      blurRadius: 5,
      spreadRadius: 0,
      shadowOpacity: 1,
      style: ''
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    // this.generateCSS();
    this.setState({ style: this.generateCSS() });
  }

  generateCSS(styles) {
    styles = styles || {};
    const rules = _.extend({}, this.state, styles);
    const css = `${rules.horizontalShift}px ${rules.verticalShift}px ${rules.blurRadius}px ${rules.spreadRadius}px rgba(0, 0, 0, ${rules.shadowOpacity})`;
    
    return css;
  }

  handleChange(cssRule, value) {
    var newState = {};
    newState[cssRule] = value;
    newState.style = this.generateCSS(newState);

    this.setState(newState);
  }

  renderPreview() {
    const style = {
      boxShadow: this.state.style
    }

    return (
      <div style={style} id="box-shadow-preview"></div>
    );
  }

  render() {
    return (
      <Generator cssRules={this.props} title="CSS Box Shadow Generator">
        {this.renderPreview()}
        <Sidebar>
          <Slider
            title="Horizontal Shift"
            name="horizontalShift"
            handleChange={this.handleChange}
            value={this.state.horizontalShift}
            min={-200}
            max={200}
          />

          <Slider
            title="Vertical Shift"
            name="verticalShift"
            handleChange={this.handleChange}
            value={this.state.verticalShift}
            min={-200}
            max={200}
          />

          <Slider
            title="Blur Radius"
            name="blurRadius"
            handleChange={this.handleChange}
            value={this.state.blurRadius}
            min={0}
            max={100}
          />

          <Slider
            title="Spread Radius"
            name="spreadRadius"
            handleChange={this.handleChange}
            value={this.state.spreadRadius}
            min={0}
          />

          <Slider
            title="Shadow Opacity"
            name="shadowOpacity"
            handleChange={this.handleChange}
            value={this.state.shadowOpacity}
            step={.01}
            min={0}
            max={1}
          />

          <CodeOutput
            property="box-shadow"
            generateCSS={() => this.generateCSS()}
          />
        </Sidebar>
      </Generator>
    );
  }
}

export default BoxShadow;