import React from 'react';
import Slider from './Slider';
import _ from 'underscore';

const Sliders = ({sliders, onChange, ...initialState}) => {
  return _.map(sliders, ({ title, name, min, max, step = 1 }) => { 
    return (
      <Slider
        key={name}
        title={title}
        name={name}
        onChange={onChange}
        value={initialState[name]}
        step={step}
        min={min}
        max={max}
      />
    );
  });
}

export default Sliders;