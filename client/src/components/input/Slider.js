import React from 'react';
import RCSlider from 'rc-slider/lib/Slider';
import RCHandle from 'rc-slider/lib/Handle';
import NumberInput from './NumberInput';
import Toggle from './Toggle';
import Select from './Select';
import { disabledTouchmove } from '../../util/helpers';

class Slider extends React.PureComponent {
  constructor(props) {
    super(props);

    this.min = props.min || 0;
    this.max = props.max || 200;
  }

  handleChange = (value) => {
    if (!this.props.disabled) {
      this.props.onChange(value, this.props.name, this.props.units);
    }
  }

  handleBeforeChange = () => {
    disabledTouchmove();
    document.activeElement.blur();
  }

  handleUnitChange = (units) => {
    if (this.props.units === units || this.props.disabled) {
      return;
    }

    let { value } = this.props;

    if (units === '%') {
      value = value / this.max * 100;
    } else {
      value = value / 100 * this.max;
    }

    this.props.onChange(parseInt(value, 10), this.props.name, units);
  }

  handleActiveToggle = (active) => {
    if (this.props.onActiveToggle) {
      this.props.onActiveToggle(active, this.props.name);
    }
  }

  renderUnitSelect() {
    if (this.props.units) {
      return (
        <Select
          options={[
            { value: 'px', label: 'px', className: 'px' },
            { value: '%', label: '%', className: 'percent' }
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
    const { 
      isActive = true,
      value, 
      optional,
      className,
      title,
      units,
      disabled,
      step = 1,
      dragging,
      appendString,
      tooltip
    } = this.props;

    const min = units === '%' ? 0 : this.min;
    const max = units === '%' ? 100 : this.max;

    // const className = ['field-wrapper'];
    const wrapperClassName = ['slider-wrapper field-wrapper'];

    if (className) wrapperClassName.push(className);
    if (units) wrapperClassName.push('has-units');
    if (disabled) wrapperClassName.push('disabled');

    const inputClassName = ['input'];
    if (!isActive) inputClassName.push('disabled');

    return (
      <div className={wrapperClassName.join(' ')}>
        <div className="table-wrapper">
          { optional ? 
            <div className="active-toggle">
              <Toggle
                onChange={this.handleActiveToggle}
                checked={isActive}
                name="active"
              />
            </div>
          : null }
          <div className={inputClassName.join(' ')}>
            {title ? 
              <label className="title">
                {title}
                {tooltip ? tooltip : null}
              </label> 
            : null}
            {this.renderUnitSelect()}          
            <NumberInput
              className="slider-input"
              value={value}
              onChange={this.handleChange}
              step={step}
              min={min}
              max={max}
              forceUpdate={dragging}
              appendString={appendString}
            />
            <RCSlider
              min={min}
              max={max}
              value={value}
              handle={Handle}
              step={step}
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

