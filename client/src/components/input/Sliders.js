import React from 'react';
import Slider from './Slider';
import _ from 'underscore';

const Sliders = ({sliders, onChange, onActiveToggle, optional, ...initialState}) => {
  const fields = _.map(sliders, ({ step = 1, divider = false, name, ...restProps }) => {

    return (
      <div key={name}>
        <Slider
          name={name}
          onChange={onChange}
          onActiveToggle={onActiveToggle}
          value={initialState[name]}
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
      className="sliders-wrapper"
    >
      {fields}
    </div>
  );
}

export default Sliders;