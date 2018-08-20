import React from 'react';
import Slider from './Slider';
import _ from 'underscore';

const Sliders = ({title, sliders, onChange, onActiveToggle, optional, ...initialState}) => {
  const fields = _.map(sliders, ({ step = 1, divider = false, name, ...restProps }) => {
    const sliderOwner = initialState[name];

    var value, isActive;
    if (typeof sliderOwner === 'object') {
      value = sliderOwner.value;
      isActive = sliderOwner.isActive;
    } else {
      value = sliderOwner;
    }

    // console.log(value)

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
  });

  return (
    <div 
      className="field-wrapper sliders-wrapper"
    >
      {title ? 
        <label className="title">{title}</label>
      : null}
      {fields}
    </div>
  );
}

export default Sliders;