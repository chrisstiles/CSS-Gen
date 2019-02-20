import React from 'react';
import Slider from './Slider';
import Toggle from './Toggle';
import { propsHaveChanged } from '../../util/helpers';

class Sliders extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isActive: true
    };
  }

  componentDidMount() {
    this.checkActive();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isActive !== this.props.isActive) {
      this.checkActive();
    }
  }

  checkActive = () => {
    const { isActive: _isActive = true, allOptional = false } = this.props;
    const isActive = _isActive || !allOptional;
    this.setState({ isActive });
  }

  handleActiveToggle = (active) => {
    if (this.props.onActiveToggle) {
      this.props.onActiveToggle(active, this.props.name);
    }
  }

  render() {
    const { 
      title, 
      sliders, 
      onChange, 
      onActiveToggle, 
      stateKey, 
      allOptional, 
      optional, 
      ...initialState 
    } = this.props;
    
    const fields = sliders.map(input => {
      // Allow passing in other react components into list of sliders
      if (React.isValidElement(input)) {
        return input;
      }

      const { step = 1, divider = false, name, ...restProps } = input;
      const sliderOwner = stateKey ? initialState[stateKey][name] : initialState[name];

      let value, isActive;
      if (typeof sliderOwner === 'object') {
        value = sliderOwner.value;
        isActive = sliderOwner.isActive;
      } else {
        value = sliderOwner;
        isActive = true;
      }

      return (
        <div key={name}>
          <Slider
            name={name}
            onChange={onChange}
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
    })

    const inputClassName = ['input'];
    const titleClassName = ['title'];

    // Disable slider if not active
    if (!this.state.isActive) {
      inputClassName.push('disabled');
      titleClassName.push('disabled');
    }

    return (
      <div className="field-wrapper sliders-wrapper">
        { allOptional || title ? 
          <div className="top table-wrapper">
            { allOptional ? 
              <div className="active-toggle">
                <Toggle
                  onChange={this.handleActiveToggle}
                  checked={this.state.isActive}
                  name="active"
                />
              </div>
            : null }
            {title ? 
              <label className={titleClassName.join(' ')}>{title}</label>
            : null}
          </div>
        : null}
        <div className={inputClassName.join(' ')}>
          {fields}
        </div>
      </div>
    );
  }
}

export default Sliders;