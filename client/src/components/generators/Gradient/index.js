import React from 'react';
import SingleWindowGenerator from '../types/SingleWindowGenerator';
import GradientInputs from './GradientInputs';

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

  generateCSS() {
    return {
      styles: {
        background: 'linear-gradient(to right, rgba(30,87,153,1) 0%,rgba(125,185,232,1) 100%)'
      },
      outputCSS: 'background: linear-gradient(to right, rgba(30,87,153,1) 0%,rgba(125,185,232,1) 100%);'
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