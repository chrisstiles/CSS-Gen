import React from 'react';
import Slider from '../../input/Slider';
import Sliders from '../../input/Sliders';
import Toggle from '../../input/Toggle';
import Select from '../../input/Select';
import ColorPicker from '../../input/ColorPicker';
import { jsToCss } from '../../../util/helpers';

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

class BorderRadiusInputs extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
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

    this.props.owner.setState(state);
  }

  render() {
    const styles = this.props.styles;
    const noBorder = styles.borderStyle === 'none';
    const disabledClassName = noBorder ? ' disabled' : '';

    return (
      <div>
        <Sliders
          sliders={radiusSlider}
          onChange={this.handleChange}
          {...styles}
        />
        <div className="corners-wrapper">
          <div className="section-title">Individual Corners</div>
          <Sliders
            sliders={cornerSliders}
            onChange={this.handleChange}
            {...styles}
          />
        </div>
        <div className="divider" />
        <div className="inputs-row">
          <Select
            name="borderStyle"
            value={styles.borderStyle}
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
            scrollWrapper="#sidebar-controls"
            searchable={false}
          />
          <div className={`field-wrapper align-right${disabledClassName}`}>
            <label className="title">Border Color</label>
            <ColorPicker
              backgroundColor={styles.borderColor}
              onChange={this.handleChange}
              className="small"
              name="borderColor"
            />
          </div>
        </div>
        <div className={`inputs-row${disabledClassName}`}>
          <Slider
            title="Border Width"
            name="borderWidth"
            onChange={this.handleChange}
            value={styles.borderWidth}
            min={0}
            max={50}
          />
          <div className="field-wrapper align-right">
            <Toggle
              onChange={this.handleChange}
              checked={styles.inset}
              label="Inset Border"
              name="inset"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default BorderRadiusInputs;