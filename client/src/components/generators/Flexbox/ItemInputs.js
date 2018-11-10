import React from 'react';
import Sliders from '../../input/Sliders';

const ItemInputs = props => {
  return (
    <div>
      <Sliders
        sliders={flexSliders}
        onChange={props.onChange}
        {...props}
      />
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
  { title: 'Flex Grow', name: 'flexGrow', min: 0, max: 10, step: .5 },
  { title: 'Flex Shrink', name: 'flexShrink', min: 0, max: 10, step: .5 },
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