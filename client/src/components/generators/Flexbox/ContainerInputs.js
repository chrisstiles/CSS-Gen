import React from 'react';
import Select from '../../input/Select';
import _ from 'underscore';
import { valueToLabel } from '../../../util/helpers';

const ContainerInputs = props => {
  const inputComponents = _.map(flexInputs, ({ name, label, options }) => {
    // Set options object
    options = _.map(options, value => {
      if (_.isObject(value)) {
        return value;
      }

      return { value, label: valueToLabel(value) }
    });

    return (
      <Select
        label={label}
        name={name}
        key={name}
        value={props[name]}
        className="half small"
        options={options}
        onChange={props.onChange}
      />
    );
  });

  return (
    <div className="clear">
      {inputComponents}
    </div>
  );
}

export default ContainerInputs;

const flexInputs = [
  {
    name: 'flexDirection',
    label: 'Flex Direction',
    options: ['row', 'column', 'row-reverse', 'column-reverse']
  },
  {
    name: 'flexWrap',
    label: 'Flex Wrap',
    options: [{ label: 'No Wrap', value: 'nowrap'}, 'wrap', 'wrap-reverse']
  },
  {
    name: 'justifyContent',
    label: 'Justify Content',
    options: [
      'normal', 'center', 'start', 'end', 'flex-start', 'flex-end', 'left',
      'right', 'space-between', 'space-around', 'space-evenly', 'stretch'
    ]
  },
  {
    name: 'alignItems',
    label: 'Align Items',
    options: [
      'normal', 'stretch', 'center', 'end', 'flex-start', 'flex-end', 
      'self-start', 'self-end', 'baseline'
    ]
  },
  {
    name: 'alignContent',
    label: 'Align Content',
    options: [
      'center', 'start', 'end', 'flex-start', 'flex-end', 'normal',
      'baseline', 'space-between', 'space-around', 'space-evenly', 'stretch'
    ]
  }
];