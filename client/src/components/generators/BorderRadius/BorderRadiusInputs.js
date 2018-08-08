import React from 'react';
import Slider from '../../input/Slider';
import Sliders from '../../input/Sliders';
import Toggle from '../../input/Toggle';
import Select from '../../input/Select';
import ColorPicker from '../../input/ColorPicker';
import { jsToCss } from '../../../util/helpers';

const minRadius = 0;
const maxRadius = 200;

class BorderRadiusInputs extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);

    this.radiusSlider = [
      { title: 'All Corners', name: 'radius', min: minRadius, max: maxRadius, divider: true, units: props.units }
    ];

    this.cornerSliders = [
      { name: 'topLeft', min: minRadius, max: maxRadius, className: 'half', units: props.topLeftUnits },
      { name: 'topRight', min: minRadius, max: maxRadius, className: 'half no-margin', units: props.topRightUnits },
      { name: 'bottomLeft', min: minRadius, max: maxRadius, className: 'half', units: props.bottomLeftUnits },
      { name: 'bottomRight', min: minRadius, max: maxRadius, className: 'half no-margin', units: props.bottomRightUnits },
    ];

    // Add elements as slider titles for individual corners
    this.cornerSliders.forEach(slider => {
      const className = `slider-image ${jsToCss(slider.name)}`;
      const title = (
        <div className={className}>
          <span></span>
          <span></span>
        </div>
      );

      slider.title = title;
    });
  }

  componentWillReceiveProps(newProps) {
    this.radiusSlider[0].units = newProps.units;

    this.cornerSliders.forEach(slider => {
      const key = slider.name + 'Units';
      slider.units = newProps[key];
    });
  }

  handleChange(value, name, units = 'px') {
    var state = {};
    state[name] = value;

    // If this is the 'All Corners' slider,
    // change all corner radii
    if (name === 'radius') {
      state.topLeft = value;
      state.topLeftUnits = units;

      state.topRight = value;
      state.topRightUnits = units;

      state.bottomRight = value;
      state.bottomRightUnits = units;

      state.bottomLeft = value;
      state.bottomLeftUnits = units;

      state.units = units;
    } else {
      const key = name + 'Units';
      state[key] = units;
    }

    this.props.owner.setState(state);
  }

  render() {
    const styles = this.props;
    const noBorder = styles.borderStyle === 'none';
    const disabledClassName = noBorder ? ' disabled' : '';

    return (
      <div>
        <Sliders
          sliders={this.radiusSlider}
          onChange={this.handleChange}
          {...styles}
        />
        <div className="corners-wrapper">
          <div className="section-title">Individual Corners</div>
          <Sliders
            sliders={this.cornerSliders}
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
            className="p70"
          />
          <div className={`field-wrapper align-right${disabledClassName}`}>
            <label className="title">Color</label>
            <ColorPicker
              color={styles.borderColor}
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
            className="p70"
            onChange={this.handleChange}
            value={styles.borderWidth}
            min={0}
            max={100}
            appendString="px"
          />
          <div className="field-wrapper align-right">
            <Toggle
              onChange={this.handleChange}
              checked={styles.inset}
              label="Inset"
              name="inset"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default BorderRadiusInputs;