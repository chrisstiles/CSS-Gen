import React from 'react';
import Generator from './Generator';
import Sidebar from './Sidebar';
import Slider from './input/Slider';
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
    this.generateCSS();
  }

  generateCSS() {
    var css = `${this.state.horizontalShift}px ${this.state.verticalShift}px ${this.state.blurRadius}px ${this.state.spreadRadius}px rgba(0, 0, 0, ${this.state.shadowOpacity})`;
    this.setState({ style: css });
  }

  handleChange(cssRule, value) {
    var newState = {};
    newState[cssRule] = value;

    this.setState(newState);
    this.generateCSS();
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
          Horizontal Shift: {this.state.horizontalShift}<br />
          <Slider
            name="horizontalShift"
            handleChange={this.handleChange}
            defaultValue={this.state.horizontalShift}
            min={-200}
            max={200}
           />

          Vertical Shift: {this.state.verticalShift}
          <Slider
             name="verticalShift"
             handleChange={this.handleChange}
             defaultValue={this.state.verticalShift}
             min={-200}
             max={200}
            />

          Blur Radius: {this.state.blurRadius}
          <Slider
            name="blurRadius"
            handleChange={this.handleChange}
            defaultValue={this.state.blurRadius}
            min={0}
           />

           Spread Radius: {this.state.spreadRadius}
           <Slider
             name="spreadRadius"
             handleChange={this.handleChange}
             defaultValue={this.state.spreadRadius}
             min={0}
            />

          Shadow Opacity: {this.state.shadowOpacity}
          <Slider
            name="shadowOpacity"
            handleChange={this.handleChange}
            defaultValue={this.state.shadowOpacity}
            step={.01}
            min={0}
            max={1}
           />
        </Sidebar>
      </Generator>
    );
  }
}

export default BoxShadow;