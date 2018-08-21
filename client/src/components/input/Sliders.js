import React from 'react';
import Slider from './Slider';
import Toggle from './Toggle';
import _ from 'underscore';

// const Sliders = ({title, sliders, onChange, onActiveToggle, stateKey = null, optional, ...initialState}) => {
  
// }

class Sliders extends React.Component {
  constructor(props) {
    super(props);

    this.checkActive(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleActiveToggle = this.handleActiveToggle.bind(this);
  }

  componentWillReceiveProps(newProps) {
    this.checkActive(newProps);
  }

  checkActive(props = this.props) {
    const { isActive = true, allOptional = false } = props;
    this.isActive = isActive || !allOptional;
  }

  handleActiveToggle(active) {
    if (this.props.onActiveToggle) {
      this.props.onActiveToggle(active, this.props.name);
    }
  }

  handleChange() {
    if (this.isActive) {
      this.props.onChange.apply(null, arguments);
    }
  }

  render() {
    const { title, sliders, onChange, onActiveToggle, stateKey, allOptional, optional, ...initialState } = this.props;

    const fields = _.map(sliders, input => {
      // Allow passing in other react components into list of sliders
      if (React.isValidElement(input)) {
        return input;
      }

      const { step = 1, divider = false, name, ...restProps } = input;
      const sliderOwner = stateKey ? initialState[stateKey][name] : initialState[name];

      var value, isActive;
      if (typeof sliderOwner === 'object') {
        value = sliderOwner.value;
        isActive = sliderOwner.isActive;
      } else {
        value = sliderOwner;
      }

      return (
        <div key={name}>
          <Slider
            name={name}
            onChange={this.handleChange}
            onActiveToggle={onActiveToggle}
            value={value}
            isActive={isActive}
            step={step}
            divider={divider}
            optional={optional}
            {...restProps}
          />

          {divider ? <div className="divider" /> : null}
        </div>
      );
    });

    var inputClassName = 'input';
    var titleClassName = 'title';

    // Disable slider if not active
    if (!this.isActive) {
      inputClassName += ' disabled';
      titleClassName += ' disabled';
    }

    return (
      <div className="field-wrapper sliders-wrapper">
        { allOptional || title ? 
          <div className="top table-wrapper">
            { allOptional ? 
              <div className="active-toggle">
                <Toggle
                  onChange={this.handleActiveToggle}
                  checked={this.isActive}
                  name="active"
                />
              </div>
            : null }
            {title ? 
              <label className={titleClassName}>{title}</label>
            : null}
          </div>
        : null}
        <div className={inputClassName}>
          {fields}
        </div>
      </div>
    );
  }
}

export default Sliders;