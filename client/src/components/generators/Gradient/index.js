import React from 'react';
import SingleWindowGenerator from '../types/SingleWindowGenerator';
import GradientInputs from './GradientInputs';
import tinygradient from 'tinygradient';

class Gradient extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      palette: [
        { pos: 0.00, color: '#eef10b' },
        { pos: 0.49, color: '#d78025' },
        { pos: 0.72, color: '#d0021b' },
        { pos: 1.00, color: '#7e20cf' }
      ],
      orientation: 'linear',
      angle: 0,
      width: 500,
      height:300
    };

    this.generateCSS = this.generateCSS.bind(this);
    this.renderInputs = this.renderInputs.bind(this);
  }

  generateCSS(styles = {}) {
    const gradient = tinygradient(this.state.palette).css();

    return {
      styles: {
        background: gradient
      },
      outputCSS: `background: ${gradient};`
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
        resetStyles={this.reset}
        styles={this.state}
        owner={this}
      />
    );
  }
}

export default Gradient;