import React from 'react';
import RCSlider, { Handle as RCHandle } from 'rc-slider';
import NumberInput from './NumberInput';
import Select from './Select';

const Handle = props => {
  const { value, dragging, index, ...restProps } = props;

  return (
    <RCHandle 
      {...restProps}
      className={'rc-slider-handle' + (props.dragging ? ' dragging' : '')}
      value={value} 
    />
  );
};

class Slider extends RCSlider {
  constructor(props) {
    super(props);

    this.min = props.min || 0;
    this.max = props.max || 200;

    this.handleChange = this.handleChange.bind(this);
    this.handleBeforeChange = this.handleBeforeChange.bind(this);
    this.handleUnitChange = this.handleUnitChange.bind(this);
  }

  handleChange(value) {
    this.props.onChange(value, this.props.name, this.props.units);
  }

  handleBeforeChange() {
    document.activeElement.blur();
  }

  handleUnitChange(units) {
    if (this.props.units === units) {
      return;
    }

    var value;

    if (units === '%') {
      value = this.props.value / this.max * 100;
    } else {
      value = this.props.value / 100 * this.max;
    }

    this.props.onChange(value, this.props.name, units);
  }

  renderUnitSelect() {
    if (this.props.units) {
      return (
        <Select
          options={[
            { value: 'px', label: 'px', className: 'shift' },
            { value: '%', label: '%' }
          ]}
          className="units-select small"
          value={this.props.units}
          onChange={this.handleUnitChange}
          searchable={false}
          menuContainer="#sidebar"
          scrollWrapper="#sidebar-controls"
          arrowRenderer={null}
          autoBlur={true}
        />
      );
    }
  }

  render() {
    const value = this.props.value || 0;
    const min = this.props.units === '%' ? 0 : this.min;
    const max = this.props.units === '%' ? 100 : this.max;

    var className = 'field-wrapper';
    if (this.props.className) {
      className += ` ${this.props.className}`;
    }

    if (this.props.units) {
      className +=  ' has-units';
    }

    return (
      <div className={className}>
        {this.renderUnitSelect()}
        <label className="title">
          <NumberInput
            className="slider-input"
            value={value}
            onChange={this.handleChange}
            step={this.props.step || 1}
            min={min}
            max={max}
            forceUpdate={this.props.dragging}
          />
          {this.props.title}
        </label>
        <RCSlider
          min={min}
          max={max}
          value={value}
          handle={Handle}
          step={this.props.step || 1}
          onBeforeChange={this.handleBeforeChange}
          onChange={this.handleChange}
          tabIndex={-1}
        />
      </div>
    );
  }
}

export default Slider;

