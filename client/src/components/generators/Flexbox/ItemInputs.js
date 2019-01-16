import React from 'react';
import Select from '../../input/Select';
import Sliders from '../../input/Sliders';
import _ from 'underscore';
import { valueToLabel } from '../../../util/helpers';

const ItemInputs = props => {
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
    <div>
      <Sliders
        sliders={flexSliders}
        onChange={props.onChange}
        {...props}
      />
      {inputComponents}
    </div>
  );
}

export default ItemInputs;
// **order
// flex-grow
// flex-shrink
// flex-basis
// **flex
// align-self

const flexSliders = [
  { title: 'Flex Grow', name: 'flexGrow', min: 0, max: 20 },
  { title: 'Flex Shrink', name: 'flexShrink', min: 0, max: 20 }
];

const flexInputs = [
  {
    name: 'alignSelf',
    label: 'Align Self',
    options: [
     'auto', 'stretch', 'center', 'flex-start', 'flex-end', 'baseline'
    ]
  }
];

// const inputs = [
//   {
//     name: 'flexWrap',
//     label: 'Flex Wrap',
//     options: [{ label: 'No Wrap', value: 'nowrap' }, 'wrap', 'wrap-reverse']
//   },
//   {
//     name: 'justifyContent',
//     label: 'Justify Content',
//     options: [
//       'normal', 'center', 'start', 'end', 'flex-start', 'flex-end', 'left',
//       'right', 'space-between', 'space-around', 'space-evenly', 'stretch'
//     ]
//   },
//   {
//     name: 'alignItems',
//     label: 'Align Items',
//     options: [
//       'normal', 'stretch', 'center', 'end', 'flex-start', 'flex-end',
//       'flex-start', 'self-start', 'self-end', 'baseline'
//     ]
//   },
//   {
//     name: 'alignContent',
//     label: 'Align Content',
//     options: [
//       'center', 'start', 'end', 'flex-start', 'flex-end', 'normal',
//       'baseline', 'space-between', 'space-around', 'space-evenly', 'stretch'
//     ]
//   }
// ];