import React from 'react';
import SingleWindowGenerator from '../types/SingleWindowGenerator';
import GradientInputs from './GradientInputs';
import generateGradient from './generate-gradient';
import _ from 'underscore';

class Gradient extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      palette: [
        { pos: 0.00, color: '#eef10b' },
        { pos: 0.10, color: '#d78025' },
        { pos: 0.72, color: '#d0021b' },
        { pos: 1.00, color: '#7e20cf' }
      ],
      type: 'linear',
      angle: 0,
      width: 300,
      height:300
    };

    this.generateCSS = this.generateCSS.bind(this);
    this.renderInputs = this.renderInputs.bind(this);
  }

  generateCSS(styles = {}) {
    // const css = {}; // The object we will return
    const rules = _.extend({}, this.state, styles);
    const gradient = generateGradient(rules.palette);

    return {
      styles: gradient.styles,
      outputCSS: gradient.css
    };
  }

  renderInputs() {
    return (
      <GradientInputs
        styles={this.state}
        owner={this}
      />
    );
  }

  render() {
    const intro = <p>Make some gradients :D. Once you are done, copy your CSS from the code output box in the bottom right.</p>;

    return (
      <SingleWindowGenerator 
        title="CSS Gradient Generator | CSS-GEN"
        previewID="gradient-preview"
        className="gradient"
        heading="CSS Gradient Generator"
        intro={intro}
        generateCSS={this.generateCSS}
        renderInputs={this.renderInputs}
        hideToolbarBackground={true}
        resetStyles={this.reset}
        styles={this.state}
        owner={this}
      />
    );
  }
}

export default Gradient;