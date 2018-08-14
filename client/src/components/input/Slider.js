import React from 'react';
import RCSlider, { Handle as RCHandle } from 'rc-slider';
import NumberInput from './NumberInput';
import Toggle from './Toggle';
import Select from './Select';

class Slider extends React.Component {
  constructor(props) {
    super(props);

    this.checkActive(props);
    this.min = props.min || 0;
    this.max = props.max || 200;

    this.handleChange = this.handleChange.bind(this);
    this.handleBeforeChange = this.handleBeforeChange.bind(this);
    this.handleUnitChange = this.handleUnitChange.bind(this);
    this.handleActiveToggle = this.handleActiveToggle.bind(this);
  }

  componentWillReceiveProps(newProps) {
    this.checkActive(newProps);
  }

  checkActive(props = this.props) {
    const { isActive = true } = props;
    this.isActive = isActive;
  }

  handleChange(value) {
    if (!this.props.disabled) {
      this.props.onChange(value, this.props.name, this.props.units);
    }
  }

  handleBeforeChange() {
    document.activeElement.blur();
  }

  handleUnitChange(units) {
    if (this.props.units === units || this.props.disabled) {
      return;
    }

    var { value } = this.props;

    if (units === '%') {
      value = value / this.max * 100;
    } else {
      value = value / 100 * this.max;
    }

    this.props.onChange(parseInt(value, 10), this.props.name, units);
  }

  handleActiveToggle(active) {
    if (this.props.onActiveToggle) {
      this.props.onActiveToggle(active, this.props.name);
    }
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
    // const { value } = this.state;
    const { value, optional } = this.props;
    const min = this.props.units === '%' ? 0 : this.min;
    const max = this.props.units === '%' ? 100 : this.max;

    var className = 'field-wrapper';
    if (this.props.className) {
      className += ` ${this.props.className}`;
    }

    if (this.props.units) {
      className +=  ' has-units';
    }

    if (this.props.disabled) {
      className += ' disabled';
    }

    var inputClassName = 'input';

    // Disable slider if not active
    if (!this.isActive) {
      inputClassName += ' disabled';
    }

    return (
      <div className={className}>
        <div className="table-wrapper">
          { optional ? 
            <div className="active-toggle">
              <Toggle
                onChange={this.handleActiveToggle}
                checked={this.isActive}
                name="active"
              />
            </div>
          : null }
          <div className={inputClassName}>
            <label className="title">{this.props.title}</label>
            {this.renderUnitSelect()}          
            <NumberInput
              className="slider-input"
              value={value}
              onChange={this.handleChange}
              step={this.props.step || 1}
              min={min}
              max={max}
              forceUpdate={this.props.dragging}
              appendString={this.props.appendString}
            />
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
        </div>
      </div>
    );
  }
}

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

export default Slider;

