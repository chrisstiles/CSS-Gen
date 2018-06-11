import React from 'react';
import SingleWindowGenerator from '../types/SingleWindowGenerator';
import Sliders from '../../input/Sliders';
import Select from '../../input/Select';
import { jsToCss } from '../../../util/helpers';
import _ from 'underscore';

const minRadius = 0;
const maxRadius = 200;

const radiusSlider = [
  { title: 'All Corners', name: 'radius', min: minRadius, max: maxRadius, divider: true }
];

const cornerSliders = [
  { name: 'topLeft', min: minRadius, max: maxRadius, className: 'half' },
  { name: 'topRight', min: minRadius, max: maxRadius, className: 'half no-margin' },
  { name: 'bottomLeft', min: minRadius, max: maxRadius, className: 'half' },
  { name: 'bottomRight', min: minRadius, max: maxRadius, className: 'half no-margin' },
];

// Add elements as slider titles for individual corners
cornerSliders.forEach(slider => {
  const className = `slider-image ${jsToCss(slider.name)}`;
  const title = (
    <div className={className}>
      <span></span>
      <span></span>
    </div>
  );

  slider.title = title;
});

class BorderRadius extends React.Component {
  constructor(props) {
    super(props);

    const defaultRadius = 10;

    this.state = {
      radius: defaultRadius,
      topLeft: defaultRadius,
      topRight: defaultRadius,
      bottomRight: defaultRadius,
      bottomLeft: defaultRadius,
      backgroundColor: 'rgba(72, 52, 212, 1)',
      borderStyle: 'none'
    };

    this.generateCSS = this.generateCSS.bind(this);
    this.reset = this.reset.bind(this);
    this.renderInputs = this.renderInputs.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  generateCSS(styles = {}) {
    const rules = _.extend({}, this.state, styles);
    
    const radii = [rules.topLeft, rules.topRight, rules.bottomRight, rules.bottomLeft];
    var allEqual = true;

    radii.forEach(element => {
      if (rules.radius !== element) {
        allEqual = false;
      }
    });

    // All corners are equal
    if (allEqual) {
      return `${rules.radius}px`;
    }

    // Return shorthand CSS if some corners are equal
    const topLeftBottomRightEqual = rules.topLeft === rules.bottomRight;
    const topRightBottomLeftEqual = rules.topRight === rules.bottomLeft;

    if (topLeftBottomRightEqual && topRightBottomLeftEqual) {
      return `${rules.topLeft}px ${rules.topRight}px`;
    } else if (topRightBottomLeftEqual) {
      return `${rules.topLeft}px ${rules.topRight}px ${rules.bottomRight}px`;
    } else {
      return `${rules.topLeft}px ${rules.topRight}px ${rules.bottomRight}px ${rules.bottomLeft}px`;
    }
  }

  reset(state) {
    this.setState(state);
  }

  handleChange(value, name) {
    var state = {};
    state[name] = value;
    
    // If this is the 'All Corners' slider,
    // change all corner radii
    if (name === 'radius') {
      state.topLeft = value;
      state.topRight = value;
      state.bottomRight = value;
      state.bottomLeft = value;
    }

    this.setState(state);
  }

  renderInputs() {
    return (
      <div>
        <Sliders
          sliders={radiusSlider}
          onChange={this.handleChange}
          {...this.state}
        />
        <div className="corners-wrapper">
          <div className="section-title">Individual Corners</div>
          <Sliders
            sliders={cornerSliders}
            onChange={this.handleChange}
            {...this.state}
          />
        </div>
        <div className="divider" />
        <Select
          name="borderStyle"
          value={this.state.borderStyle}
          label="Border Type"
          onChange={this.handleChange}
          options={[
            { value: 'none', label: 'None' },
            { value: 'solid', label: 'Solid' },
            { value: 'dotted', label: 'Dotted' },
            { value: 'dashed', label: 'Dashed' },
            { value: 'double', label: 'Double' },
            { value: 'groove', label: 'Groove' },
            { value: 'ridge', label: 'Ridge' },
            { value: 'inset', label: 'Inset' },
            { value: 'outset', label: 'Outset' }
          ]}
          menuContainer="#sidebar"
        />
      </div>
    );
  }

  render() {
    return (
      <SingleWindowGenerator 
        title="CSS Border Radius Generator | CSS-GEN"
        previewID="border-radius-preview"
        className="border-radius"
        property="border-radius"
        heading="CSS Border Radius Generator"
        generateCSS={this.generateCSS}
        renderInputs={this.renderInputs}
        resetStyles={this.reset}
        previewSize={{ width: 300, height: 300 }}
        defaultStyles={this.state}
      />
    );
  }
}

export default BorderRadius;




