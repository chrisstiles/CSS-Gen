import React from 'react';
import Slider from './Slider';
import _ from 'underscore';

const Sliders = ({sliders, onChange, ...initialState}) => {
  const fields = _.map(sliders, ({ title, name, min, max, step = 1, divider = false, className }) => { 
    return (
      <div key={name}>
        <Slider
          title={title}
          name={name}
          onChange={onChange}
          className={className}
          value={initialState[name]}
          step={step}
          min={min}
          max={max}
        />

        {divider ? <div className="divider" /> : null}
      </div>
    );
  });

  return (
    <div 
      className="sliders-wrapper"
    >
      {fields}
    </div>
  );
}

export default Sliders;